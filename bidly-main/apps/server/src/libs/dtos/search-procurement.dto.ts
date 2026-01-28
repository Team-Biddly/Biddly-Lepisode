import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';
import { OffsetSearchOptionDTO } from './search-option.dto';

export class SearchProcurementDTO extends OffsetSearchOptionDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  담당자?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '') return null;

    return Array.isArray(value) ? value : [value];
  })
  keywords?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '') return null;

    return Array.isArray(value) ? value : [value];
  })
  andKeywords?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '') return null;

    return Array.isArray(value) ? value : [value];
  })
  orKeywords?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '') return null;

    return Array.isArray(value) ? value : [value];
  })
  notKeywords?: string[];

  bookmarkUserId?: string;
}
