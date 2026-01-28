import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { AdminStatus, fnGetKeyByValue } from '@common';
import { BlockLogDTO } from './block-log.dto';

@Exclude()
export class AdminDTO {
  @Expose()
  @ApiProperty({
    description: '관리자 ID',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: '관리자 상태',
    enum: Object.keys(AdminStatus),
  })
  @Transform(({ obj }) =>
    obj?.blockedAt
      ? fnGetKeyByValue(AdminStatus, AdminStatus.BLOCKED)
      : fnGetKeyByValue(AdminStatus, AdminStatus.ACTIVE),
  )
  status: keyof typeof AdminStatus;

  @Expose()
  @ApiProperty({ description: '권한', enum: Object.keys(AdminRole) })
  role: keyof typeof AdminRole;

  @Expose()
  @ApiProperty({
    description: '관리자 이메일',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.includes('___')) {
      return '-';
    }
    return value;
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: '관리자 이름',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: '리프레시 토큰',
  })
  refreshToken: string;

  @Expose()
  @ApiProperty({
    description: '관리자 생성일',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: '관리자 수정일',
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    description: '순번',
  })
  rowNumber: number;

  @ApiProperty({
    description: '내가 차단 당한 로그',
    nullable: true,
    isArray: true,
    type: () => BlockLogDTO,
  })
  @Expose()
  @Type(() => BlockLogDTO)
  blockedLogs?: BlockLogDTO[];
}
