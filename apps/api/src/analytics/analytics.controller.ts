import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { AnalyticsService } from './analytics.service';

type AuthReq = {
  user?: {
    sub: string;
  };
};

@Controller('analytics')
@UseGuards(AccessTokenGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  track(
    @Req() req: AuthReq,
    @Body() body: { eventName: string; properties?: Record<string, unknown> },
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.analyticsService.track(userId, body);
  }
}
