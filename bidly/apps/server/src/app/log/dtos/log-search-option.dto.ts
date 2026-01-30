import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OffsetSearchOptionDTO } from 'apps/server/src/libs';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LogSearchOptionDTO extends OffsetSearchOptionDTO {
  @ApiProperty({
    description: '관리자 아이디',
    required: false,
  })
  @IsOptional()
  adminId?: string;

  @ApiProperty({ description: '타겟 모델', required: false })
  @IsOptional({ message: '모델을 입력해주세요.' })
  targetModel?: string;

  @ApiProperty({ description: '타겟 ID', required: false })
  @IsOptional()
  targetId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  userId?: string;
}
