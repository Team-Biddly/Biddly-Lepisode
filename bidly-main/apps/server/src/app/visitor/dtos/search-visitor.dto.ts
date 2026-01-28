import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { OffsetSearchOptionDTO } from '../../../libs';

export class SearchVisitorDTO extends OffsetSearchOptionDTO {
  @IsOptional()
  @ApiProperty({ description: '시작일', required: false })
  @Type(() => Date)
  startAt?: Date;

  @IsOptional()
  @ApiProperty({ description: '종료일', required: false })
  @Type(() => Date)
  endAt?: Date;

  @IsOptional()
  @ApiProperty({ description: '검색 타입', required: false })
  type?: 'day' | 'week' | 'month' | 'year';
}
