import { Body, Controller, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { EventStatus } from '@prisma/client';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { EventsService } from './events.service';

type AuthReq = {
  user?: {
    sub: string;
  };
};

@Controller('organizer/events')
@UseGuards(AccessTokenGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(
    @Req() req: AuthReq,
    @Body()
    body: {
      title: string;
      descriptionShort: string;
      descriptionLong?: string | null;
      coverImageUrl: string;
      categoryId: string;
      cityId: string;
      venueId: string;
      countryCode: string;
      timezone: string;
      startAt: string;
      endAt?: string | null;
      ticketUrl?: string | null;
      priceMin?: number | string | null;
      priceMax?: number | string | null;
      status?: EventStatus;
    },
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    return this.eventsService.createOrganizerEvent(userId, body);
  }

  @Get()
  list(@Req() req: AuthReq) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    return this.eventsService.listOrganizerEvents(userId);
  }

  @Get(':id')
  getById(@Req() req: AuthReq, @Param('id') id: string) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    return this.eventsService.getOrganizerEvent(userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthReq,
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      descriptionShort?: string;
      descriptionLong?: string | null;
      coverImageUrl?: string;
      categoryId?: string;
      cityId?: string;
      venueId?: string;
      countryCode?: string;
      timezone?: string;
      startAt?: string;
      endAt?: string | null;
      ticketUrl?: string | null;
      priceMin?: number | string | null;
      priceMax?: number | string | null;
      status?: EventStatus;
    },
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    return this.eventsService.updateOrganizerEvent(userId, id, body);
  }
}
