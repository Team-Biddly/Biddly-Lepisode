import { Expose, Type } from 'class-transformer';
import { RoleDTO } from '../../user/role/dtos/role.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MenuPermissionDTO {
  @Expose()
  @ApiProperty({ description: '메뉴 권한 ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: '생성 권한' })
  canCreate: boolean;

  @Expose()
  @ApiProperty({ description: '읽기 권한' })
  canRead: boolean;

  @Expose()
  @ApiProperty({ description: '수정 권한' })
  canUpdate: boolean;

  @Expose()
  @ApiProperty({ description: '삭제 권한' })
  canDelete: boolean;

  @Expose()
  @ApiProperty({ description: '레벨' })
  level: number;

  @Expose()
  @ApiProperty({ description: '역할', type: () => RoleDTO })
  @Type(() => RoleDTO)
  role: RoleDTO;

  @Expose()
  @ApiProperty({ description: '등록일' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: '수정일' })
  updatedAt: Date;
}
