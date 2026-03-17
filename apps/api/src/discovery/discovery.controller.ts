import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_CONFIG } from '../auth/auth.constants';
import { DiscoveryQuery, DiscoveryService } from './discovery.service';

type RawDiscoveryQuery = {
  cityId?: string;
  categories?: string;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: string;
  maxPrice?: string;
  lat?: string;
  lng?: string;
  radiusKm?: string;
  limit?: string;
  cursor?: string;
};

@Controller('events')
export class DiscoveryController {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async listEvents(@Req() req: { headers?: Record<string, string> }, @Query() query: RawDiscoveryQuery) {
    const userId = await this.resolveUserId(req);
    return this.discoveryService.getFeed(userId, this.parseQuery(query));
  }

  @Get('map')
  async map(@Req() req: { headers?: Record<string, string> }, @Query() query: RawDiscoveryQuery) {
    const userId = await this.resolveUserId(req);
    return this.discoveryService.getMapPins(userId, this.parseQuery(query));
  }

  @Get(':id')
  async getById(@Req() req: { headers?: Record<string, string> }, @Param('id') id: string) {
    const userId = await this.resolveUserId(req);
    return this.discoveryService.getEventById(userId, id);
  }

  private parseQuery(query: RawDiscoveryQuery): DiscoveryQuery {
    const categories = (query.categories || '')
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    return {
      cityId: query.cityId,
      categories,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      minPrice: this.parseNumber(query.minPrice),
      maxPrice: this.parseNumber(query.maxPrice),
      lat: this.parseNumber(query.lat),
      lng: this.parseNumber(query.lng),
      radiusKm: this.parseNumber(query.radiusKm),
      limit: this.parseNumber(query.limit),
      cursor: query.cursor,
    };
  }

  private parseNumber(value?: string) {
    if (value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private async resolveUserId(req: { headers?: Record<string, string> }) {
    const authHeader = req.headers?.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (!token) {
      return null;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: AUTH_CONFIG.accessSecret,
      });

      return (payload.sub as string) || null;
    } catch {
      return null;
    }
  }
}
