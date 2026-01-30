import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { model } from '@angular/core';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '@common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { BookmarkDTO } from './dtos/bookmark.dto';
import { ToggleBookmarkDTO } from './dtos/toggle-bookmark.dto';

@ApiTags('Bookmark')
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('my')
  @Auth(UserRole.USER)
  @ApiOkResponse({ type: BookmarkDTO, isArray: true })
  async findMy(@GetUser() user: User) {
    return this.bookmarkService.findByUserId(user.id);
  }

  @Patch()
  @Auth(UserRole.USER)
  @ApiBody({ type: ToggleBookmarkDTO })
  @ApiOkResponse({ type: Boolean })
  async toggle(
    @GetUser() user: User,
    @Body() body: ToggleBookmarkDTO,
  ): Promise<boolean> {
    return await this.bookmarkService.toggle({
      userId: user.id,
      ...body,
    });
  }
}
