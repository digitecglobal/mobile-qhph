import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { UsersService } from './users.service';

type AuthReq = {
  user?: {
    sub: string;
  };
};

@Controller('me')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getMyProfile(@Req() req: AuthReq) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.usersService.getProfile(userId);
  }

  @Post('onboarding')
  saveOnboarding(
    @Req() req: AuthReq,
    @Body() body: { cityId: string; interestCategoryIds: string[] },
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.usersService.updateOnboarding(userId, body);
  }
}
