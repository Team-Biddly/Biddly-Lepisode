import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { StatisticDTO, UserStatisticDTO } from './dtos/statistic.dto';
import { StatisticService } from './statistic.service';
import { plainToInstance } from 'class-transformer';
import { DatePipe } from '@angular/common';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get()
  @ApiOkResponse({
    type: StatisticDTO,
  })
  @ApiOperation({
    summary: '통계 조회',
  })
  async findStatistic() {
    return plainToInstance(
      StatisticDTO,
      await this.statisticService.findStatistic(),
    );
  }

  @Get('users')
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
      },
    },
    isArray: true,
  })
  async getSignUpUsersByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return plainToInstance(
      UserStatisticDTO,
      await this.statisticService.getSignUpUsersByDate(startDate, endDate),
    );
  }
}
