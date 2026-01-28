import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends PartialType(
  OmitType(CreateUserDTO, ['password', 'confirmPassword']),
) {}

export class UpdatePasswordDTO {
  @ApiPropertyOptional({
    description: '기존 비밀번호',
    required: false,
  })
  @IsOptional({ message: '기존 비밀번호를 입력해 주세요.' })
  oldPassword?: string;

  @ApiProperty({
    description: '사용자 비밀번호',
  })
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  password: string;

  @ApiProperty({
    description: '사용자 비밀번호 확인',
  })
  @IsNotEmpty({ message: '비밀번호 확인을 입력해 주세요.' })
  confirmedPassword: string;

  @ApiPropertyOptional({
    description: '토큰',
    required: false,
  })
  @IsOptional()
  token?: string;

  @ApiProperty({
    description: '사용자 연락처',
    required: false,
  })
  @IsOptional({
    message: '연락처를 입력해 주세요.',
  })
  contact?: string;
}

export class UpdateContactDTO {
  @ApiProperty({
    description: '사용자 연락처',
  })
  @IsNotEmpty({
    message: '연락처를 입력해 주세요.',
  })
  @IsPhoneNumber('KR', {
    message: '유효한 전화번호를 입력해 주세요.',
  })
  contact: string;
}
