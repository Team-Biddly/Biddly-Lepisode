import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { SearchProcurementDTO } from '../../../libs/dtos/search-procurement.dto';

export class SearchBidDTO extends SearchProcurementDTO {
  @ApiPropertyOptional()
  @IsOptional()
  공고기관?: string;

  @ApiPropertyOptional()
  @IsOptional()
  수요기관?: string;

  @ApiPropertyOptional()
  @IsOptional()
  입찰개시일시시작?: string;

  @ApiPropertyOptional()
  @IsOptional()
  입찰개시일시종료?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  budgetStartPrice?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  budgetEndPrice?: string;

  @ApiPropertyOptional({
    enum: ['service', 'thing', 'construction', 'foreign'],
  })
  @IsOptional()
  type?: 'service' | 'thing' | 'construction' | 'foreign';

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : undefined,
  )
  모의공고여부?: boolean;
}
