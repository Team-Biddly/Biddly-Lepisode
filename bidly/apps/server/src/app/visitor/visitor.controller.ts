import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VisitorService } from './visitor.service';
import { Request, Response } from 'express';
import { RequestVisitorDTO, VisitorDTO } from './dtos/visitor.dto';
import { FindVisitorDTO } from './dtos/find-visitor.dto';
import { VisitorChartDataDTO } from './dtos/visitor-chart.dto';
import { OffsetPaginationDTO } from '../../libs';
import { plainToInstance } from 'class-transformer';
import { SearchVisitorDTO } from './dtos/search-visitor.dto';

@ApiTags('visitor')
@Controller({ path: 'visitor' })
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Get('search')
  @ApiOperation({ summary: '방문자 조회' })
  @ApiOkResponse({
    type: OffsetPaginationDTO,
  })
  async getVisitors(
    @Query() option: SearchVisitorDTO,
  ): Promise<OffsetPaginationDTO<VisitorDTO>> {
    const [items, count] = await this.visitorService.searchVisitors(option);
    return {
      items: plainToInstance(VisitorDTO, items),
      pageInfo: {
        pageItems: items.length,
        totalItems: count,
        pageNo: option.pageNo,
        pageSize: option.pageSize,
        totalPages: Math.ceil(count / option.pageSize),
      },
    };
  }

  @Get('total-visit')
  @ApiOperation({ summary: '총 방문자 수 조회' })
  @ApiOkResponse({
    type: VisitorChartDataDTO,
  })
  async getTotalVisitors(@Query() findOption: FindVisitorDTO) {
    const result = await this.visitorService.findTotalVisitors(findOption);
    return plainToInstance(VisitorChartDataDTO, result);
  }

  @Get('popular-page')
  @ApiOperation({ summary: '인기 페이지 조회' })
  @ApiOkResponse({
    type: VisitorChartDataDTO,
  })
  async getPopularPage(@Query() findOption: FindVisitorDTO) {
    const result = await this.visitorService.findPopularPage(findOption);
    return plainToInstance(VisitorChartDataDTO, result);
  }

  @Get('incoming-page')
  @ApiOperation({ summary: '유입 페이지 조회' })
  @ApiOkResponse({
    type: VisitorChartDataDTO,
  })
  async getIncomingPage(@Query() findOption: FindVisitorDTO) {
    const result = await this.visitorService.findIncomingPage(findOption);
    return plainToInstance(VisitorChartDataDTO, result);
  }

  @Get('device-type')
  @ApiOperation({ summary: '총 방문자 수 조회' })
  @ApiOkResponse({
    type: VisitorChartDataDTO,
  })
  async getDeviceType(@Query() findOption: FindVisitorDTO) {
    const result = await this.visitorService.findDeviceType(findOption);
    return plainToInstance(VisitorChartDataDTO, result);
  }

  @Post()
  async trackVisitor(
    @Req() request: Request,
    @Res() response: Response,
    @Body() body: RequestVisitorDTO,
  ) {
    const ip =
      request.ip ||
      request.headers['x-forwarded-for'] ||
      request.socket.remoteAddress;
    const userAgent = request.headers['user-agent'] || 'unknown';

    const visitor = await this.visitorService.createVisitor(body, userAgent);

    return response.status(201).json(visitor); // 저장된 방문자 데이터 반환
  }
}
