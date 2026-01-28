import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RoleDTO } from './role.dto';

export class RoleLevelPermissionDTO {
  @Expose()
  @ApiProperty({ description: 'id', type: String })
  id: string;

  @Expose()
  @ApiProperty({ description: 'level', type: Number })
  level: number;

  @Expose()
  @ApiProperty({ description: '기본 여부', type: Boolean })
  @Type(() => Boolean)
  default: boolean;

  @Expose()
  @ApiProperty({ description: '최고 권한 여부', type: Boolean })
  @Type(() => Boolean)
  super: boolean;

  @Expose()
  @ApiProperty({ description: 'permission', type: String })
  permission: string;

  @Expose()
  @ApiProperty({ description: '설명' })
  description: string;

  @Expose()
  @ApiProperty({ description: 'role', type: () => RoleDTO })
  @Type(() => RoleDTO)
  role: RoleDTO;
}
