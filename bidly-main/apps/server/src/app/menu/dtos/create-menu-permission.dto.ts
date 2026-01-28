import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateMenuPermissionDTO {
  @IsNotEmpty({ message: '생성 권한을 선택해주세요' })
  @ApiProperty({ description: '생성 권한', type: Boolean })
  @Type(() => Boolean)
  canCreate: boolean;

  @IsNotEmpty({ message: '읽기 권한을 선택해주세요' })
  @ApiProperty({ description: '읽기 권한', type: Boolean })
  @Type(() => Boolean)
  canRead: boolean;

  @IsNotEmpty({ message: '수정 권한을 선택해주세요' })
  @ApiProperty({ description: '수정 권한', type: Boolean })
  @Type(() => Boolean)
  canUpdate: boolean;

  @IsNotEmpty({ message: '삭제 권한을 선택해주세요' })
  @ApiProperty({ description: '삭제 권한', type: Boolean })
  @Type(() => Boolean)
  canDelete: boolean;

  @IsNotEmpty({ message: '레벨을 입력해주세요' })
  @ApiProperty({ description: '레벨', type: Number })
  @Type(() => Number)
  level: number;

  @IsNotEmpty({ message: '역할을 선택해주세요' })
  @ApiProperty({ description: '역할' })
  roleId: string;
}

export class UpdateMenuPermissionDTO extends PartialType(
  CreateMenuPermissionDTO,
) {}
