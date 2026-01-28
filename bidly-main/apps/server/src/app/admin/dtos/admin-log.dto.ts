import { ApiProperty } from '@nestjs/swagger';
import { LOG_ACTION } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { AdminDTO } from './admin.dto';

@Exclude()
export class AdminLogDTO {
  @Expose()
  @ApiProperty({
    description: '액션 로그',
  })
  action: string;

  @Expose()
  @ApiProperty({
    description: '로그 내용',
  })
  content: keyof typeof LOG_ACTION;

  @Expose()
  @ApiProperty({
    description: '대상 모델',
  })
  targetModel: string;

  @Expose()
  @ApiProperty({
    description: '모델 ID',
  })
  targetId: string;

  @Expose()
  @ApiProperty({
    description: '관리자',
    type: () => AdminDTO,
  })
  admin: AdminDTO;

  @Expose()
  @ApiProperty({
    description: '로그 일시',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: '순번',
  })
  rowNumber: number;
}
