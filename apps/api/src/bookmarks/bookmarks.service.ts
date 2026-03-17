import { Injectable, NotFoundException } from '@nestjs/common';
import { EventStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async bookmarkEvent(userId: string, eventId: string) {
    await this.ensureEventExists(eventId);

    await this.prisma.eventBookmark.upsert({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      create: {
        userId,
        eventId,
      },
      update: {},
    });

    return { bookmarked: true };
  }

  async unbookmarkEvent(userId: string, eventId: string) {
    await this.prisma.eventBookmark.deleteMany({
      where: {
        userId,
        eventId,
      },
    });

    return { bookmarked: false };
  }

  async listMyBookmarks(userId: string) {
    const rows = await this.prisma.eventBookmark.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        event: {
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
              select: { id: true, name: true, slug: true, isVerified: true },
            },
          },
        },
      },
      take: 200,
    });

    return {
      items: rows
        .filter((row) => row.event.status !== EventStatus.cancelled)
        .map((row) => ({
          eventId: row.eventId,
          bookmarkedAt: row.createdAt,
          event: {
            ...row.event,
            priceMin: this.decimalToNumber(row.event.priceMin),
            priceMax: this.decimalToNumber(row.event.priceMax),
            venue: {
              ...row.event.venue,
              latitude: this.decimalToNumber(row.event.venue.latitude),
              longitude: this.decimalToNumber(row.event.venue.longitude),
            },
          },
        })),
    };
  }

  private async ensureEventExists(eventId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        status: EventStatus.published,
      },
      select: {
        id: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }
  }

  private decimalToNumber(value: Prisma.Decimal | null) {
    if (value === null) {
      return null;
    }
    return Number(value);
  }
}
