import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { OffsetSearchOptionDTO } from '../../../libs';

export class AdminLogSearchOptionDTO extends OffsetSearchOptionDTO {
  @ApiProperty({
    description: '관리자 아이디',
    required: false,
  })
  @IsOptional()
  adminId?: string;
}
