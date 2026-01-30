import { ApiProperty } from '@nestjs/swagger';
import { OffsetSearchOptionDTO } from '../../../libs';
import { IsOptional } from 'class-validator';
import { UserStatusTarget } from '@common';

export class SearchUserDTO extends OffsetSearchOptionDTO {
  @ApiProperty({
    description: '사용자 상태 타입',
    required: false,
    enum: Object.keys(UserStatusTarget),
  })
  @IsOptional()
  targetType?: UserStatusTarget;
}
