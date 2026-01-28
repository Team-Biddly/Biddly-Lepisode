import { UserRole } from '@common';
import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseDatePipe,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ApiOffsetPagination } from '../../libs';
import { OpenAPISyncLogDTO } from '../../libs/dtos/openapi-sync-log.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { OrderPlanDTO } from './dtos/order-plan.dto';
import { SearchOrderPlanDTO } from './dtos/search-order-plan.dto';
import { OrderPlanSyncService } from './order-plan-sync.service';
import { OrderPlanService } from './order-plan.service';
import { Response } from 'express';

@ApiTags('OrderPlan')
@Controller('order-plan')
export class OrderPlanController {
  constructor(
    private readonly orderPlanService: OrderPlanService,
    private readonly orderPlanSyncService: OrderPlanSyncService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @Get('search')
  @ApiOperation({ summary: '발주계획 검색' })
  @ApiOffsetPagination(OrderPlanDTO)
  async search(@Query() options: SearchOrderPlanDTO) {
    return this.orderPlanService.search(options);
  }

  @Get('bookmark')
  @Auth(UserRole.USER)
  @ApiOperation({ summary: '즐겨찾기한 발주계획 검색' })
  @ApiOffsetPagination(OrderPlanDTO)
  async getBookmarked(
    @GetUser() user: User,
    @Query() options: SearchOrderPlanDTO,
  ) {
    return this.orderPlanService.search({
      ...options,
      bookmarkUserId: user.id,
    });
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: '발주계획 조회' })
  @ApiOkResponse({ type: OrderPlanDTO })
  async findById(@Param('id') id: string) {
    return plainToInstance(
      OrderPlanDTO,
      await this.orderPlanService.findById(id),
      { groups: ['detail'] },
    );
  }

  @Get('log/latest')
  @ApiOperation({ summary: '최근 동기화 로그 조회' })
  @ApiOkResponse({ type: OpenAPISyncLogDTO })
  async getLatestLog() {
    return plainToInstance(
      OpenAPISyncLogDTO,
      await this.orderPlanService.getLatestLog(),
    );
  }

  @Post('sync')
  @ApiOperation({ summary: '발주계획 수동 동기화' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async syncOrderPlans(
    @Query('startDate', new ParseDatePipe()) startDate?: string,
    @Query('endDate', new ParseDatePipe()) endDate?: string,
  ) {
    this.orderPlanSyncService.syncOrderPlans(startDate, endDate);
    return;
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

    const excel = await this.orderPlanService.createExcelFile(body.ids);

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
    await this.orderPlanService.updateKeywords(id, body.keywords);
    await this.clearCache(id);
  }

  private async clearCache(id: string) {
    const key = `/api/order-plan/${id}`;
    await this.cache.del(key);
  }
}
