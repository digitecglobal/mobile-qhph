import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type CreateEventInput = {
  title: string;
  descriptionShort: string;
  descriptionLong?: string | null;
  coverImageUrl: string;
  categoryId: string;
  cityId: string;
  venueId: string;
  countryCode: string;
  timezone: string;
  startAt: string;
  endAt?: string | null;
  ticketUrl?: string | null;
  priceMin?: number | string | null;
  priceMax?: number | string | null;
  status?: EventStatus;
};

type UpdateEventInput = Partial<CreateEventInput>;

type NormalizedEventData = {
  title: string;
  descriptionShort: string;
  descriptionLong: string | null;
  coverImageUrl: string;
  categoryId: string;
  cityId: string;
  venueId: string;
  countryCode: string;
  timezone: string;
  startAt: Date;
  endAt: Date | null;
  ticketUrl: string | null;
  priceMin: Prisma.Decimal | null;
  priceMax: Prisma.Decimal | null;
  status: EventStatus;
};

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganizerEvent(userId: string, input: CreateEventInput) {
    this.validateRequiredFields(input);

    const organizer = await this.ensureOrganizer(userId);
    const normalized = this.normalizeCreateInput(input);

    await this.ensureCoreReferences(normalized);
    await this.assertNoPotentialDuplicate(normalized);

    const slug = await this.generateUniqueSlug(normalized.title);

    const event = await this.prisma.event.create({
      data: {
        id: randomUUID(),
        slug,
        organizerId: organizer.id,
        venueId: normalized.venueId,
        categoryId: normalized.categoryId,
        cityId: normalized.cityId,
        countryCode: normalized.countryCode,
        timezone: normalized.timezone,
        title: normalized.title,
        descriptionShort: normalized.descriptionShort,
        descriptionLong: normalized.descriptionLong,
        coverImageUrl: normalized.coverImageUrl,
        ticketUrl: normalized.ticketUrl,
        priceMin: normalized.priceMin,
        priceMax: normalized.priceMax,
        startAt: normalized.startAt,
        endAt: normalized.endAt,
        status: normalized.status,
      },
    });

    await this.audit(userId, 'create_event', event.id, {
      status: event.status,
      title: event.title,
    });

    if (event.status === EventStatus.published) {
      await this.audit(userId, 'publish_event', event.id, {
        status: event.status,
      });
    }

    return event;
  }

  async listOrganizerEvents(userId: string) {
    const organizer = await this.ensureOrganizer(userId);
    return this.prisma.event.findMany({
      where: { organizerId: organizer.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getOrganizerEvent(userId: string, eventId: string) {
    const organizer = await this.ensureOrganizer(userId);
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, organizerId: organizer.id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async updateOrganizerEvent(userId: string, eventId: string, input: UpdateEventInput) {
    const organizer = await this.ensureOrganizer(userId);
    const current = await this.assertEventOwnership(organizer.id, eventId);

    if (input.status && !Object.values(EventStatus).includes(input.status)) {
      throw new BadRequestException('Invalid event status');
    }

    const normalized = this.normalizeUpdateInput(current, input);
    await this.ensureCoreReferences(normalized);
    await this.assertNoPotentialDuplicate(normalized, eventId);

    const data: Prisma.EventUncheckedUpdateInput = {
      title: normalized.title,
      descriptionShort: normalized.descriptionShort,
      descriptionLong: normalized.descriptionLong,
      coverImageUrl: normalized.coverImageUrl,
      categoryId: normalized.categoryId,
      cityId: normalized.cityId,
      venueId: normalized.venueId,
      countryCode: normalized.countryCode,
      timezone: normalized.timezone,
      startAt: normalized.startAt,
      endAt: normalized.endAt,
      ticketUrl: normalized.ticketUrl,
      priceMin: normalized.priceMin,
      priceMax: normalized.priceMax,
      status: normalized.status,
      cancelledAt:
        normalized.status === EventStatus.cancelled ? new Date() : normalized.status !== current.status ? null : current.cancelledAt,
    };

    if (normalized.title !== current.title) {
      data.slug = await this.generateUniqueSlug(normalized.title, eventId);
    }

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data,
    });

    await this.audit(userId, 'update_event', updated.id, {
      previousStatus: current.status,
      currentStatus: updated.status,
    });

    if (current.status !== updated.status) {
      const action =
        updated.status === EventStatus.published
          ? 'publish_event'
          : updated.status === EventStatus.cancelled
            ? 'cancel_event'
            : 'change_event_status';

      await this.audit(userId, action, updated.id, {
        previousStatus: current.status,
        currentStatus: updated.status,
      });
    }

    return updated;
  }

  private async ensureOrganizer(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.prisma.organizer.findUnique({
      where: { userId: user.id },
    });

    if (existing) {
      return existing;
    }

    const slugBase = this.slugify(user.email.split('@')[0] || `org-${user.id.slice(0, 8)}`);
    const slug = await this.generateOrganizerSlug(slugBase);

    return this.prisma.organizer.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        name: user.email,
        slug,
      },
    });
  }

  private async assertEventOwnership(organizerId: string, eventId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, organizerId },
      select: {
        id: true,
        title: true,
        descriptionShort: true,
        descriptionLong: true,
        coverImageUrl: true,
        categoryId: true,
        cityId: true,
        venueId: true,
        countryCode: true,
        timezone: true,
        startAt: true,
        endAt: true,
        ticketUrl: true,
        priceMin: true,
        priceMax: true,
        status: true,
        cancelledAt: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  private validateRequiredFields(input: CreateEventInput) {
    const required = [
      input.title,
      input.descriptionShort,
      input.coverImageUrl,
      input.categoryId,
      input.cityId,
      input.venueId,
      input.countryCode,
      input.timezone,
      input.startAt,
    ];

    if (required.some((item) => !item || String(item).trim() === '')) {
      throw new BadRequestException('Missing required fields');
    }
  }

  private normalizeCreateInput(input: CreateEventInput): NormalizedEventData {
    const data: NormalizedEventData = {
      title: (input.title || '').trim(),
      descriptionShort: (input.descriptionShort || '').trim(),
      descriptionLong: input.descriptionLong?.trim() || null,
      coverImageUrl: (input.coverImageUrl || '').trim(),
      categoryId: input.categoryId,
      cityId: input.cityId,
      venueId: input.venueId,
      countryCode: (input.countryCode || '').trim().toUpperCase(),
      timezone: (input.timezone || '').trim(),
      startAt: new Date(input.startAt),
      endAt: input.endAt ? new Date(input.endAt) : null,
      ticketUrl: input.ticketUrl?.trim() || null,
      priceMin: this.toDecimal(input.priceMin),
      priceMax: this.toDecimal(input.priceMax),
      status: input.status || EventStatus.draft,
    };

    this.validateDataQuality(data);
    return data;
  }

  private normalizeUpdateInput(
    current: {
      title: string;
      descriptionShort: string;
      descriptionLong: string | null;
      coverImageUrl: string;
      categoryId: string;
      cityId: string;
      venueId: string;
      countryCode: string;
      timezone: string;
      startAt: Date;
      endAt: Date | null;
      ticketUrl: string | null;
      priceMin: Prisma.Decimal | null;
      priceMax: Prisma.Decimal | null;
      status: EventStatus;
    },
    input: UpdateEventInput,
  ): NormalizedEventData {
    const data: NormalizedEventData = {
      title: input.title?.trim() || current.title,
      descriptionShort: input.descriptionShort?.trim() || current.descriptionShort,
      descriptionLong:
        input.descriptionLong === undefined ? current.descriptionLong : (input.descriptionLong?.trim() || null),
      coverImageUrl: input.coverImageUrl?.trim() || current.coverImageUrl,
      categoryId: input.categoryId || current.categoryId,
      cityId: input.cityId || current.cityId,
      venueId: input.venueId || current.venueId,
      countryCode: (input.countryCode || current.countryCode).trim().toUpperCase(),
      timezone: (input.timezone || current.timezone).trim(),
      startAt: input.startAt ? new Date(input.startAt) : current.startAt,
      endAt: input.endAt === undefined ? current.endAt : input.endAt ? new Date(input.endAt) : null,
      ticketUrl: input.ticketUrl === undefined ? current.ticketUrl : input.ticketUrl?.trim() || null,
      priceMin: input.priceMin === undefined ? current.priceMin : this.toDecimal(input.priceMin),
      priceMax: input.priceMax === undefined ? current.priceMax : this.toDecimal(input.priceMax),
      status: input.status || current.status,
    };

    this.validateDataQuality(data);
    return data;
  }

  private validateDataQuality(input: NormalizedEventData) {
    if (input.title.length < 5) {
      throw new BadRequestException('Title must have at least 5 characters');
    }

    if (input.descriptionShort.length < 25) {
      throw new BadRequestException('descriptionShort must have at least 25 characters');
    }

    if (!this.isHttpUrl(input.coverImageUrl)) {
      throw new BadRequestException('coverImageUrl must be a valid http(s) URL');
    }

    if (input.ticketUrl && !this.isHttpUrl(input.ticketUrl)) {
      throw new BadRequestException('ticketUrl must be a valid http(s) URL');
    }

    if (Number.isNaN(input.startAt.valueOf())) {
      throw new BadRequestException('startAt is invalid');
    }

    if (input.endAt && Number.isNaN(input.endAt.valueOf())) {
      throw new BadRequestException('endAt is invalid');
    }

    if (input.endAt && input.endAt < input.startAt) {
      throw new BadRequestException('endAt must be greater than or equal to startAt');
    }

    const min = input.priceMin ? Number(input.priceMin) : null;
    const max = input.priceMax ? Number(input.priceMax) : null;

    if (min !== null && min < 0) {
      throw new BadRequestException('priceMin must be positive');
    }

    if (max !== null && max < 0) {
      throw new BadRequestException('priceMax must be positive');
    }

    if (min !== null && max !== null && min > max) {
      throw new BadRequestException('priceMin cannot be greater than priceMax');
    }
  }

  private async ensureCoreReferences(input: NormalizedEventData) {
    const [city, category, venue] = await Promise.all([
      this.prisma.city.findUnique({ where: { id: input.cityId }, select: { id: true } }),
      this.prisma.eventCategory.findUnique({ where: { id: input.categoryId }, select: { id: true } }),
      this.prisma.venue.findUnique({ where: { id: input.venueId }, select: { id: true, cityId: true } }),
    ]);

    if (!city) {
      throw new NotFoundException('City not found');
    }

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    if (venue.cityId !== input.cityId) {
      throw new BadRequestException('Venue does not belong to selected city');
    }
  }

  private async assertNoPotentialDuplicate(input: NormalizedEventData, currentEventId?: string) {
    const startWindow = new Date(input.startAt.getTime() - 3 * 60 * 60 * 1000);
    const endWindow = new Date(input.startAt.getTime() + 3 * 60 * 60 * 1000);

    const existing = await this.prisma.event.findFirst({
      where: {
        id: currentEventId ? { not: currentEventId } : undefined,
        cityId: input.cityId,
        venueId: input.venueId,
        startAt: {
          gte: startWindow,
          lte: endWindow,
        },
        title: {
          equals: input.title,
          mode: 'insensitive',
        },
        status: {
          in: [EventStatus.draft, EventStatus.published],
        },
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      throw new ConflictException('Potential duplicate event detected');
    }
  }

  private async audit(actorId: string, action: string, entityId: string, metadata: Record<string, unknown>) {
    await this.prisma.auditLog.create({
      data: {
        id: randomUUID(),
        actorId,
        action,
        entity: 'event',
        entityId,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });
  }

  private toDecimal(value: number | string | null | undefined) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const number = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(number)) {
      throw new BadRequestException('Invalid price value');
    }

    return new Prisma.Decimal(number);
  }

  private isHttpUrl(value: string) {
    return /^https?:\/\//i.test(value);
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  private async generateUniqueSlug(title: string, currentEventId?: string) {
    const base = this.slugify(title) || 'evento';
    let candidate = base;
    let counter = 1;

    while (true) {
      const existing = await this.prisma.event.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });

      if (!existing || existing.id === currentEventId) {
        return candidate;
      }

      counter += 1;
      candidate = `${base}-${counter}`;
    }
  }

  private async generateOrganizerSlug(base: string) {
    let candidate = base || 'organizer';
    let counter = 1;

    while (true) {
      const existing = await this.prisma.organizer.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }

      counter += 1;
      candidate = `${base}-${counter}`;
    }
  }
}
