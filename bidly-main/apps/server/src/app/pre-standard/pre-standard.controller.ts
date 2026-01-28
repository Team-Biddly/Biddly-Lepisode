import { UserRole } from '@common';
import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ApiOffsetPagination } from '../../libs';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { PreStandardDTO } from './dtos/pre-standard.dto';
import { SearchPreStandardDTO } from './dtos/search-pre-standard.dto';
import { PreStandardSyncService } from './pre-standard-sync.service';
import { PreStandardService } from './pre-standard.service';
import { Response } from 'express';

@ApiTags('PreStandard')
@ApiExtraModels(SearchPreStandardDTO)
@Controller('pre-standard')
export class PreStandardController {
  constructor(
    private readonly preStandardService: PreStandardService,
    private readonly syncService: PreStandardSyncService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @Get('search')
  @ApiOperation({ summary: '사전규격 공고 검색' })
  @ApiOffsetPagination(PreStandardDTO)
  async search(@Query() query: SearchPreStandardDTO) {
    return this.preStandardService.search(query);
  }

  @Get('bookmark')
  @Auth(UserRole.USER)
  @ApiOperation({ summary: '즐겨찾기한 발주계획 검색' })
  @ApiOffsetPagination(PreStandardDTO)
  async getBookmarked(
    @GetUser() user: User,
    @Query() options: SearchPreStandardDTO,
  ) {
    return this.preStandardService.search({
      ...options,
      bookmarkUserId: user.id,
    });
  }

  @Get('log/latest')
  @ApiOperation({ summary: '최근 동기화 로그 조회' })
  @ApiOkResponse({ type: PreStandardDTO })
  async getLatestLog() {
    return plainToInstance(
      PreStandardDTO,
      await this.preStandardService.getLatestLog(),
    );
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: '사전규격 공고 조회' })
  @ApiOkResponse({ type: PreStandardDTO })
  async findById(@Param('id') id: string) {
    return plainToInstance(
      PreStandardDTO,
      await this.preStandardService.findById(id),
      { groups: ['detail'] },
    );
  }

  @Post('sync')
  @ApiOperation({ summary: '사전규격 공고 동기화' })
  async sync() {
    return this.syncService.syncPrestandards();
  }

  @Post('download')
  @ApiOperation({ summary: '입찰공고 파일 다운로드' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  @ApiOkResponse({
    schema: { type: 'string', format: 'binary' },
  })
  async download(
    @Body() body: { ids: string[] },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (body.ids.length === 0) {
      throw new BadRequestException('올바르지 않은 요청입니다.');
    }

    const excel = await this.preStandardService.createExcelFile(body.ids);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="bids.xlsx"',
    });

    res.send(excel);
  }

  @Patch(':id/keywords')
  @Auth(UserRole.ADMIN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  async updateKeywords(
    @Param('id') id: string,
    @Body() body: { keywords: string[] },
  ) {
    await this.preStandardService.updateKeywords(id, body.keywords);
    await this.clearCache(id);
  }

  private async clearCache(id: string) {
    const key = `/api/pre-standard/${id}`;
    await this.cache.del(key);
  }
}
