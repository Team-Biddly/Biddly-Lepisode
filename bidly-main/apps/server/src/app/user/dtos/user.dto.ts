import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider, UserAccountStatus } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { RoleLevelPermissionDTO } from '../role/dtos/permission.dto';

@Exclude()
export class AuthDTO {
  @ApiProperty({
    description: 'Auth 아이디',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Auth 제공자',
    enum: Object.keys(AuthProvider),
  })
  @Expose()
  provider: keyof typeof AuthProvider;

  @ApiProperty({
    description: 'Auth 제공자 이메일',
  })
  @Expose()
  @Transform(({ value }) =>
    value?.includes('__') ? value.split('__')[1] : value,
  )
  email: string;
}

@Exclude()
export class UserWithdrawnDTO {
  @ApiProperty({
    description: '탈퇴 사유',
  })
  @Expose()
  withdrawnReason: string;
  @ApiProperty({
    description: '탈퇴 진행 일자',
  })
  @Expose()
  createdAt: string;
  @ApiProperty({
    description: '탈퇴 완료 일자',
  })
  @Expose()
  until?: string;
}

@Exclude()
export class UserBlockDTO {
  @ApiProperty({
    description: '차단 진행 일자',
  })
  @Expose()
  createdAt: string;
  @ApiProperty({
    description: '차단 완료 일자',
  })
  @Expose()
  until?: string;
}

@Exclude()
export class UserDTO {
  @ApiProperty({
    description: '사용자 ID',
    example: 'M000000000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: '사용자 연락처',
    example: '01012345678',
  })
  @Expose()
  @Transform(({ value }) =>
    value?.includes('__') ? value.split('__')[1] : value,
  )
  contact: string;

  @ApiProperty({
    description: '사용자 등록 일자',
    example: new Date(),
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '사용자 수정 일자',
    example: new Date(),
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: '사용자 탈퇴 일자',
    example: new Date(),
    nullable: true,
  })
  @Expose()
  withdrawnAt?: Date;

  @ApiProperty({
    description: '소셜 로그인 정보',
    nullable: false,
    type: AuthDTO,
    isArray: true,
  })
  @Type(() => AuthDTO)
  @Expose()
  auths: AuthDTO[];

  @ApiProperty({
    description: '사용자 차단 여부',
    example: false,
  })
  @Expose()
  @Transform(({ obj }) => {
    if (!obj?.blockLogs) return false;
    if (obj.blockLogs.length > 0 && obj.blockLogs[0].until >= new Date()) {
      return true;
    }

    return false;
  })
  blocked: boolean;

  @ApiProperty({
    description: '사용자 계정 상태',
    example: false,
    enum: UserAccountStatus,
  })
  @Expose()
  status: UserAccountStatus;

  @ApiProperty({
    description: '사용자 탈퇴 내역',
    nullable: true,
  })
  @Expose()
  @Type(() => UserWithdrawnDTO)
  withdrawnLogs?: UserWithdrawnDTO[];

  /**
   * @caution ResponseBody에 노출되지 않는 필드
   */
  blockLogs?: UserBlockDTO[];

  @ApiProperty({
    description: '사용자 권한',
    type: () => RoleLevelPermissionDTO,
  })
  @Expose()
  @Type(() => RoleLevelPermissionDTO)
  permission: RoleLevelPermissionDTO;

  @ApiProperty({
    description: 'accessToken',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    description: '사용자 이메일',
  })
  @Expose()
  @Transform(({ value }) =>
    value?.includes('__') ? value.split('__')[1] : value,
  )
  email: string;
}
