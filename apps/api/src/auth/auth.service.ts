import { randomUUID } from 'node:crypto';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_CONFIG } from './auth.constants';
import { AuthTokens, AuthUser } from './auth.types';

type LoginInput = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: LoginInput): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const email = this.normalizeEmail(input.email);
    const password = this.validatePassword(input.password);

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        passwordHash,
      },
    });

    const authUser = this.toAuthUser(user);
    const tokens = await this.signTokens(authUser);

    return { user: authUser, tokens };
  }

  async login(input: LoginInput): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const email = this.normalizeEmail(input.email);
    const password = this.validatePassword(input.password);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const authUser = this.toAuthUser(user);
    const tokens = await this.signTokens(authUser);

    return { user: authUser, tokens };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new BadRequestException('Missing refresh token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: AUTH_CONFIG.refreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub as string },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.signTokens(this.toAuthUser(user));
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private normalizeEmail(email: string): string {
    const normalized = (email || '').trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      throw new BadRequestException('Invalid email');
    }
    return normalized;
  }

  private validatePassword(password: string): string {
    if (!password || password.length < 8) {
      throw new BadRequestException('Password must have at least 8 characters');
    }
    return password;
  }

  private toAuthUser(user: { id: string; email: string; role: AuthUser['role'] }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  private async signTokens(user: AuthUser): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: AUTH_CONFIG.accessSecret,
        expiresIn: AUTH_CONFIG.accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: AUTH_CONFIG.refreshSecret,
        expiresIn: AUTH_CONFIG.refreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
