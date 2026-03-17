import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from './access-token.guard';
import { AuthService } from './auth.service';

type AuthInput = {
  email: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: AuthInput) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: AuthInput) {
    return this.authService.login(body);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken?: string }) {
    return this.authService.refresh(body.refreshToken || '');
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  me(@Req() req: { user?: { sub: string; email: string; role: string } }) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role,
    };
  }
}
