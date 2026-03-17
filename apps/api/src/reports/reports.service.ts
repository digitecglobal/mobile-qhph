import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async reportEvent(userId: string, eventId: string, input: { reason: string; details?: string }) {
    const reason = (input.reason || '').trim();
    const details = input.details?.trim();

    if (!reason) {
      throw new BadRequestException('reason is required');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const existing = await this.prisma.eventReport.findFirst({
      where: {
        eventId,
        reporterId: userId,
        status: {
          in: ['open', 'reviewing'],
        },
      },
      select: { id: true, status: true, createdAt: true },
    });

    if (existing) {
      return {
        id: existing.id,
        status: existing.status,
        createdAt: existing.createdAt,
        deduplicated: true,
      };
    }

    const report = await this.prisma.eventReport.create({
      data: {
        id: randomUUID(),
        eventId,
        reporterId: userId,
        reason,
        details: details || null,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        id: randomUUID(),
        actorId: userId,
        action: 'report_event',
        entity: 'event_report',
        entityId: report.id,
        metadata: {
          eventId,
          reason,
        },
      },
    });

    return {
      ...report,
      deduplicated: false,
    };
  }
}
