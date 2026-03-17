import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { BookmarksService } from './bookmarks.service';

type AuthReq = {
  user?: {
    sub: string;
  };
};

@Controller()
@UseGuards(AccessTokenGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('events/:id/bookmark')
  bookmark(@Req() req: AuthReq, @Param('id') eventId: string) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.bookmarksService.bookmarkEvent(userId, eventId);
  }

  @Delete('events/:id/bookmark')
  unbookmark(@Req() req: AuthReq, @Param('id') eventId: string) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.bookmarksService.unbookmarkEvent(userId, eventId);
  }

  @Get('me/bookmarks')
  list(@Req() req: AuthReq) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.bookmarksService.listMyBookmarks(userId);
  }
}
