import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDTO {
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @ApiProperty({ description: '이름' })
  name: string;

  @IsOptional()
  @ApiProperty({ description: '설명', required: false })
  description: string;
}

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {}
