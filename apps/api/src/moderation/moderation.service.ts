import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReportStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async listReports(status?: ReportStatus) {
    return this.prisma.eventReport.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        event: {
          select: { id: true, title: true, status: true, startAt: true },
        },
        reporter: {
          select: { id: true, email: true, role: true },
        },
      },
    });
  }

  async updateReportStatus(reportId: string, status: ReportStatus) {
    if (!['open', 'reviewing', 'resolved', 'dismissed'].includes(status)) {
      throw new BadRequestException('Invalid report status');
    }

    const report = await this.prisma.eventReport.findUnique({
      where: { id: reportId },
      select: { id: true },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return this.prisma.eventReport.update({
      where: { id: reportId },
      data: {
        status,
        resolvedAt: status === 'resolved' || status === 'dismissed' ? new Date() : null,
      },
    });
  }
}
