import { Expose, Type } from 'class-transformer';
import { RoleLevelPermissionDTO } from './permission.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDTO {
  @Expose()
  @ApiProperty({ description: 'ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: '이름' })
  name: string;

  @Expose()
  @ApiProperty({ description: '기본 여부', type: Boolean })
  @Type(() => Boolean)
  default: boolean;

  @Expose()
  @ApiProperty({ description: '설명' })
  description: string;

  @Expose()
  @ApiProperty({
    description: '권한',
    type: () => RoleLevelPermissionDTO,
    isArray: true,
  })
  @Type(() => RoleLevelPermissionDTO)
  permissions: RoleLevelPermissionDTO[];
}
