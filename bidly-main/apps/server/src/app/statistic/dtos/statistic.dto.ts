import { ApiProperty } from '@nestjs/swagger';
import { Statistic } from '../statistic.type';

export class StatisticBidDTO {
  @ApiProperty({
    description: '발주 계획 수',
  })
  plans: number;

  @ApiProperty({
    description: '사전 규격 수',
  })
  specs: number;

  @ApiProperty({
    description: '입찰 공고 수',
  })
  notices: number;
}

export class StatisticUserDTO {
  @ApiProperty({
    description: '오늘 가입한 회원 수',
  })
  today: number;

  @ApiProperty({
    description: '가입한지 7일이 지난 회원 수',
  })
  week: number;

  @ApiProperty({
    description: '가입한지 3일이 지난 회원 수',
  })
  threeDays: number;
}

export class StatisticDTO implements Statistic {
  @ApiProperty({
    description: '가입 회원 통계',
    type: StatisticUserDTO,
  })
  user: StatisticUserDTO;

  @ApiProperty({
    description: '조달 통계',
    type: StatisticBidDTO,
  })
  bid: StatisticBidDTO;
}

export class UserStatisticDTO {
  @ApiProperty({
    description: '최초 사용자 가입 날짜',
  })
  startsAt: Date;

  @ApiProperty({
    description: '마지막 사용자 가입 날짜',
  })
  endsAt: Date;

  @ApiProperty({
    description: '가입자 수',
  })
  data: number[];

  @ApiProperty({
    description: '년월 정보',
  })
  xaxis: string[];
}
