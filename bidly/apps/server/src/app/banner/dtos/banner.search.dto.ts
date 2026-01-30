import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { OffsetSearchOptionDTO } from '../../../libs';

export class BannerSearchDTO extends OffsetSearchOptionDTO {
  @ApiPropertyOptional({
    description: '노출 여부',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isExposed?: boolean;

  @ApiPropertyOptional({
    description: '생성 시작일시',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  startCreatedAt?: Date;

  @ApiPropertyOptional({
    description: '생성 종료일시',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  endCreatedAt?: Date;

  @ApiPropertyOptional({
    description: '모드(웹용/모바일용)',
    type: String,
  })
  @IsOptional()
  mode?: string;

  constructor() {
    super();
    this.query = '';
    this.isExposed = undefined;
    this.startCreatedAt = undefined;
    this.endCreatedAt = undefined;
  }
}
