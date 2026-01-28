import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindVisitorDTO {
  @IsOptional()
  @ApiProperty({ description: '시작일', required: false })
  startAt?: Date;

  @IsOptional()
  @ApiProperty({ description: '종료일', required: false })
  endAt?: Date;

  @IsOptional()
  @ApiProperty({ description: '검색 타입', required: false })
  type?: 'day' | 'week' | 'month' | 'year';
}
