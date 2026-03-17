import { Injectable, NotFoundException } from '@nestjs/common';
import { EventStatus, Prisma, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type DiscoveryQuery = {
  cityId?: string;
  categories?: string[];
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  limit?: number;
  cursor?: string;
};

type FeedItem = {
  id: string;
  slug: string | null;
  title: string;
  descriptionShort: string;
  coverImageUrl: string;
  ticketUrl: string | null;
  startAt: Date;
  endAt: Date | null;
  status: EventStatus;
  countryCode: string;
  cityId: string;
  timezone: string;
  category: {
    id: string;
    slug: string;
    name: string;
    icon: string | null;
  };
  venue: {
    id: string;
    name: string;
    addressLine: string;
    latitude: number | null;
    longitude: number | null;
  };
  organizer: {
    id: string;
    name: string;
    slug: string;
    isVerified: boolean;
  };
  priceMin: number | null;
  priceMax: number | null;
  verificationStatus: VerificationStatus;
  distanceKm: number | null;
  rankingScore: number;
  isBookmarked: boolean;
};

type FeedResult = {
  items: FeedItem[];
  nextCursor: string | null;
};

type EventWithRelations = Prisma.EventGetPayload<{
  include: {
    category: {
      select: { id: true; slug: true; name: true; icon: true };
    };
    venue: {
      select: {
        id: true;
        name: true;
        addressLine: true;
        latitude: true;
        longitude: true;
      };
    };
    organizer: {
      select: { id: true; name: true; slug: true; isVerified: true };
    };
  };
}>;

@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(userId: string | null, query: DiscoveryQuery): Promise<FeedResult> {
    try {
      return await this.getFeedFromDb(userId, query);
    } catch {
      return { items: [], nextCursor: null };
    }
  }

  async getMapPins(userId: string | null, query: DiscoveryQuery) {
    const feed = await this.getFeed(userId, {
      ...query,
      limit: Math.min(Math.max(query.limit ?? 120, 1), 200),
    });

    return {
      pins: feed.items
        .filter((item) => item.venue.latitude !== null && item.venue.longitude !== null)
        .map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category.slug,
          latitude: item.venue.latitude,
          longitude: item.venue.longitude,
          startAt: item.startAt,
          coverImageUrl: item.coverImageUrl,
        })),
    };
  }

  async getEventById(userId: string | null, eventId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        status: EventStatus.published,
      },
      include: {
        category: { select: { id: true, slug: true, name: true, icon: true } },
        venue: {
          select: {
            id: true,
            name: true,
            addressLine: true,
            latitude: true,
            longitude: true,
          },
        },
        organizer: {
          select: {
            id: true,
            name: true,
            slug: true,
            isVerified: true,
          },
        },
        media: {
          select: { id: true, mediaUrl: true, mediaType: true },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const isBookmarked =
      userId === null
        ? false
        : !!(await this.prisma.eventBookmark.findUnique({
            where: {
              userId_eventId: {
                userId,
                eventId,
              },
            },
            select: { eventId: true },
          }));

    return {
      ...this.toFeedItem(event, null, 0, false),
      descriptionLong: event.descriptionLong,
      media: event.media,
      isBookmarked,
    };
  }

  private async getFeedFromDb(userId: string | null, query: DiscoveryQuery): Promise<FeedResult> {
    const now = new Date();
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);
    const bufferLimit = Math.min(Math.max(limit * 4, 80), 300);
    const radiusKm = query.radiusKm ?? 10;

    const userContext = userId ? await this.getUserContext(userId) : null;
    const cityId = query.cityId || userContext?.cityId || undefined;
    const categoryIds = await this.resolveCategoryIds(query.categories ?? []);

    const where: Prisma.EventWhereInput = {
      status: EventStatus.published,
      startAt: {
        gte: query.dateFrom ? new Date(query.dateFrom) : now,
      },
    };

    if (query.dateTo) {
      where.startAt = {
        ...(where.startAt as Prisma.DateTimeFilter),
        lte: new Date(query.dateTo),
      };
    }

    if (query.cursor) {
      const cursorDate = new Date(query.cursor);
      if (!Number.isNaN(cursorDate.valueOf())) {
        where.startAt = {
          ...(where.startAt as Prisma.DateTimeFilter),
          gt: cursorDate,
        };
      }
    }

    if (cityId) {
      where.cityId = cityId;
    }

    if (categoryIds.length) {
      where.categoryId = { in: categoryIds };
    }

    const events = await this.prisma.event.findMany({
      where,
      include: {
        category: {
          select: { id: true, slug: true, name: true, icon: true },
        },
        venue: {
          select: {
            id: true,
            name: true,
            addressLine: true,
            latitude: true,
            longitude: true,
          },
        },
        organizer: {
          select: {
            id: true,
            name: true,
            slug: true,
            isVerified: true,
          },
        },
      },
      orderBy: [{ startAt: 'asc' }, { createdAt: 'desc' }],
      take: bufferLimit,
    });

    const bookmarkIds = await this.resolveBookmarkIds(
      userId,
      events.map((event) => event.id),
    );

    const ranked = events
      .map((event) => {
        const distanceKm = this.computeDistanceKm(
          query.lat,
          query.lng,
          this.decimalToNumber(event.venue.latitude),
          this.decimalToNumber(event.venue.longitude),
        );

        if (distanceKm !== null && query.radiusKm && distanceKm > query.radiusKm) {
          return null;
        }

        const priceMin = this.decimalToNumber(event.priceMin);
        const priceMax = this.decimalToNumber(event.priceMax);

        if (query.minPrice !== undefined && priceMax !== null && priceMax < query.minPrice) {
          return null;
        }

        if (query.maxPrice !== undefined && priceMin !== null && priceMin > query.maxPrice) {
          return null;
        }

        const interestScore = userContext?.interestCategoryIds.has(event.categoryId) ? 1 : 0;
        const temporalScore = this.computeTemporalScore(event.startAt, now);
        const proximityScore = this.computeDistanceScore(distanceKm, radiusKm);
        const qualityScore = this.computeQualityScore(event);
        const verificationScore = this.computeVerificationScore(event.verificationStatus);
        const rankingScore =
          0.35 * temporalScore +
          0.3 * proximityScore +
          0.2 * interestScore +
          0.1 * qualityScore +
          0.05 * verificationScore;

        return this.toFeedItem(event, distanceKm, rankingScore, bookmarkIds.has(event.id));
      })
      .filter((event): event is FeedItem => event !== null)
      .sort((a, b) => {
        if (b.rankingScore !== a.rankingScore) {
          return b.rankingScore - a.rankingScore;
        }
        return a.startAt.getTime() - b.startAt.getTime();
      });

    const items = ranked.slice(0, limit);

    return {
      items,
      nextCursor: ranked.length > limit ? items[items.length - 1]?.startAt.toISOString() ?? null : null,
    };
  }

  private async getUserContext(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        cityId: true,
        interests: {
          select: {
            categoryId: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      cityId: user.cityId,
      interestCategoryIds: new Set(user.interests.map((item) => item.categoryId)),
    };
  }

  private async resolveCategoryIds(categorySlugs: string[]) {
    if (!categorySlugs.length) {
      return [];
    }

    const categories = await this.prisma.eventCategory.findMany({
      where: {
        slug: { in: categorySlugs },
      },
      select: {
        id: true,
      },
    });

    return categories.map((category) => category.id);
  }

  private async resolveBookmarkIds(userId: string | null, eventIds: string[]) {
    if (!userId || !eventIds.length) {
      return new Set<string>();
    }

    const bookmarks = await this.prisma.eventBookmark.findMany({
      where: {
        userId,
        eventId: { in: eventIds },
      },
      select: {
        eventId: true,
      },
    });

    return new Set(bookmarks.map((bookmark) => bookmark.eventId));
  }

  private decimalToNumber(value: Prisma.Decimal | null) {
    if (value === null) {
      return null;
    }
    return Number(value);
  }

  private computeDistanceKm(
    originLat: number | undefined,
    originLng: number | undefined,
    targetLat: number | null,
    targetLng: number | null,
  ) {
    if (
      originLat === undefined ||
      originLng === undefined ||
      targetLat === null ||
      targetLng === null
    ) {
      return null;
    }

    const earthRadiusKm = 6371;
    const dLat = this.toRad(targetLat - originLat);
    const dLng = this.toRad(targetLng - originLng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(originLat)) *
        Math.cos(this.toRad(targetLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  private toRad(value: number) {
    return (value * Math.PI) / 180;
  }

  private computeTemporalScore(startAt: Date, now: Date) {
    const hoursUntilStart = (startAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilStart <= 0) {
      return 0;
    }

    const normalized = Math.min(hoursUntilStart, 24 * 14) / (24 * 14);
    return 1 - normalized;
  }

  private computeDistanceScore(distanceKm: number | null, radiusKm: number) {
    if (distanceKm === null) {
      return 0.5;
    }
    const normalized = Math.min(distanceKm, radiusKm) / radiusKm;
    return 1 - normalized;
  }

  private computeQualityScore(event: EventWithRelations) {
    const checks = [
      event.descriptionLong ? 1 : 0,
      event.ticketUrl ? 1 : 0,
      event.endAt ? 1 : 0,
      event.coverImageUrl.startsWith('http') ? 1 : 0,
      event.priceMin !== null || event.priceMax !== null ? 1 : 0,
    ];

    return checks.reduce((acc, value) => acc + value, 0) / checks.length;
  }

  private computeVerificationScore(status: VerificationStatus) {
    if (status === VerificationStatus.trusted_source) {
      return 1;
    }
    if (status === VerificationStatus.verified_manual) {
      return 0.5;
    }
    return 0;
  }

  private toFeedItem(
    event: EventWithRelations,
    distanceKm: number | null,
    rankingScore: number,
    isBookmarked: boolean,
  ): FeedItem {
    return {
      id: event.id,
      slug: event.slug,
      title: event.title,
      descriptionShort: event.descriptionShort,
      coverImageUrl: event.coverImageUrl,
      ticketUrl: event.ticketUrl,
      startAt: event.startAt,
      endAt: event.endAt,
      status: event.status,
      countryCode: event.countryCode,
      cityId: event.cityId,
      timezone: event.timezone,
      category: event.category,
      venue: {
        id: event.venue.id,
        name: event.venue.name,
        addressLine: event.venue.addressLine,
        latitude: this.decimalToNumber(event.venue.latitude),
        longitude: this.decimalToNumber(event.venue.longitude),
      },
      organizer: event.organizer,
      priceMin: this.decimalToNumber(event.priceMin),
      priceMax: this.decimalToNumber(event.priceMax),
      verificationStatus: event.verificationStatus,
      distanceKm,
      rankingScore,
      isBookmarked,
    };
  }
}
