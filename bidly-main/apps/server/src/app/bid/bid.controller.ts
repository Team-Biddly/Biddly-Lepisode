import { UserRole } from '@common';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
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
  getSchemaPath,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { ApiOffsetPagination } from '../../libs';
import { OpenAPISyncLogDTO } from '../../libs/dtos/openapi-sync-log.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { BidSyncService } from './bid-sync.service';
import { BidService } from './bid.service';
import { BidConstructionDTO } from './dtos/bid-construction.dto';
import { BidForeignDTO } from './dtos/bid-foreign.dto';
import { BidServiceDTO } from './dtos/bid-service.dto';
import { BidThingDTO } from './dtos/bid-thing.dto';
import { BidViewDTO } from './dtos/bid-view.dto';
import { SearchBidDTO } from './dtos/search-bid.dto';

@ApiTags('Bid')
@Controller('bid')
@ApiExtraModels(
  BidConstructionDTO,
  BidForeignDTO,
  BidServiceDTO,
  BidThingDTO,
  BidViewDTO,
)
export class BidController {
  constructor(
    private readonly bidService: BidService,
    private readonly syncService: BidSyncService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @Get('search')
  @ApiOperation({ summary: '입찰공고 검색' })
  @ApiOffsetPagination(BidViewDTO)
  async search(@Query() query: SearchBidDTO) {
    return this.bidService.search(query);
  }

  @Get('bookmark')
  @Auth(UserRole.USER)
  @ApiOperation({ summary: '즐겨찾기한 발주계획 검색' })
  @ApiOffsetPagination(BidViewDTO)
  async getBookmarked(@GetUser() user: User, @Query() options: SearchBidDTO) {
    return this.bidService.search({
      ...options,
      bookmarkUserId: user.id,
    });
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: '입찰공고 조회' })
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(BidConstructionDTO) },
        { $ref: getSchemaPath(BidForeignDTO) },
        { $ref: getSchemaPath(BidServiceDTO) },
        { $ref: getSchemaPath(BidThingDTO) },
      ],
    },
  })
  async findById(
    @Param('id') id: string,
  ): Promise<BidConstructionDTO | BidForeignDTO | BidServiceDTO | BidThingDTO> {
    return this.bidService.findById(id);
  }

  @Get('log/latest')
  @ApiOperation({ summary: '최근 동기화 로그 조회' })
  @ApiOkResponse({ type: OpenAPISyncLogDTO })
  async getLatestLog() {
    return plainToInstance(
      OpenAPISyncLogDTO,
      await this.bidService.getLatestLog(),
    );
  }

  @Post('sync')
  @ApiOperation({ summary: '입찰공고 동기화' })
  async sync() {
    this.syncService.syncBids();
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

    const excel = await this.bidService.createExcelFile(body.ids);

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
    await this.bidService.updateKeywords(id, body.keywords);
    await this.clearCache(id);
  }

  private async clearCache(id: string) {
    const key = `/api/bid/${id}`;
    await this.cache.del(key);
  }
}
