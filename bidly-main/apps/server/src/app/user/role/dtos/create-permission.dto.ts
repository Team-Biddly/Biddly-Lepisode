import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleLevelPermissionDTO {
  @IsNotEmpty({ message: 'level을 입력해주세요.' })
  @ApiProperty({ description: 'level', type: Number })
  @Type(() => Number)
  level: number;

  @IsNotEmpty({ message: '권한명을 입력해주세요.' })
  @ApiProperty({ description: 'permission', type: String })
  permission: string;

  @IsNotEmpty({ message: '권한 ID를 입력해주세요.' })
  @ApiProperty({ description: '권한 ID', type: String })
  roleId: string;

  @IsOptional()
  @ApiProperty({ description: 'description', type: String, required: false })
  description: string;
}

export class UpdateRoleLevelPermissionDTO extends PartialType(
  CreateRoleLevelPermissionDTO,
) {}
