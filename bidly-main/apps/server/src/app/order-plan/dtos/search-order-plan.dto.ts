import { PreStandardType } from '@common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { SearchProcurementDTO } from '../../../libs/dtos/search-procurement.dto';

export class SearchOrderPlanDTO extends SearchProcurementDTO {
  @ApiPropertyOptional()
  @IsOptional()
  발주기관?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  startPrice?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  endPrice?: string;

  @ApiPropertyOptional({ enum: PreStandardType })
  @IsOptional()
  type?: PreStandardType;
}
