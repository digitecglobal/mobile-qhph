import { Body, Controller, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { ReportsService } from './reports.service';

type AuthReq = {
  user?: {
    sub: string;
  };
};

@Controller('events')
@UseGuards(AccessTokenGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post(':id/report')
  reportEvent(
    @Req() req: AuthReq,
    @Param('id') id: string,
    @Body() body: { reason: string; details?: string },
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.reportsService.reportEvent(userId, id, body);
  }
}
