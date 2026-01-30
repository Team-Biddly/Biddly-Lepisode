import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { OffsetSearchOptionDTO } from '../../../libs';

export class FileSearchDTO extends OffsetSearchOptionDTO {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'columnId',
  })
  columnId?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'columnName',
  })
  columnName?: string;
}
