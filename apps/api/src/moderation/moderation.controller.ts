import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ReportStatus } from '@prisma/client';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ModerationService } from './moderation.service';

@Controller('admin/reports')
@UseGuards(AccessTokenGuard, new RolesGuard(['admin', 'moderator']))
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get()
  listReports(@Query('status') status?: ReportStatus) {
    return this.moderationService.listReports(status);
  }

  @Patch(':id')
  updateReport(@Param('id') id: string, @Body() body: { status: ReportStatus }) {
    return this.moderationService.updateReportStatus(id, body.status);
  }
}
