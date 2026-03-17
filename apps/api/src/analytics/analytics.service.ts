import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const ALLOWED_EVENTS = new Set([
  'onboarding_completed',
  'feed_loaded',
  'filter_applied',
  'event_opened',
  'event_bookmarked',
  'ticket_link_clicked',
  'organizer_event_published',
  'push_permission_result',
  'location_permission_result',
]);

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async track(userId: string, payload: { eventName: string; properties?: Record<string, unknown> }) {
    const eventName = (payload.eventName || '').trim();

    if (!eventName) {
      throw new BadRequestException('eventName is required');
    }

    if (!ALLOWED_EVENTS.has(eventName)) {
      throw new BadRequestException('eventName not allowed');
    }

    const row = await this.prisma.auditLog.create({
      data: {
        id: randomUUID(),
        actorId: userId,
        action: eventName,
        entity: 'analytics_event',
        entityId: randomUUID(),
        metadata: (payload.properties || {}) as Prisma.InputJsonValue,
      },
      select: {
        id: true,
        action: true,
        createdAt: true,
      },
    });

    return {
      ok: true,
      tracked: row.action,
      id: row.id,
      createdAt: row.createdAt,
    };
  }
}
