import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
} from 'class-validator';

export class ContactValidationDTO {
  @ApiPropertyOptional({
    description: '사용자 이름',
    example: '홍길동',
  })
  @IsOptional()
  @MaxLength(20, { message: '사용자 이름은 20자 이하로 입력해 주세요.' })
  name?: string;

  @ApiProperty({
    description: '전화번호',
    example: '01012345678',
  })
  @IsNotEmpty({ message: '전화번호를 입력해 주세요.' })
  @MaxLength(20, { message: '전화번호는 11자 이하로 입력해 주세요.' })
  @IsPhoneNumber('KR', { message: '전화번호 형식이 올바르지 않습니다.' })
  contact: string;
}

export class VerifyContactDTO {
  @ApiProperty({
    description: '인증번호',
  })
  @IsNotEmpty({ message: '인증번호를 입력해 주세요.' })
  @MaxLength(6, { message: '인증번호는 6자리 입니다.' })
  code: string;

  @ApiProperty({
    description: '전화번호',
  })
  @IsNotEmpty({ message: '전화번호를 입력해 주세요.' })
  @MaxLength(20, { message: '전화번호는 11자 이하로 입력해 주세요.' })
  @IsPhoneNumber('KR', { message: '전화번호 형식이 올바르지 않습니다.' })
  contact: string;

  @ApiProperty({
    description: '토큰',
  })
  @IsNotEmpty({ message: '토큰을 입력해 주세요.' })
  token: string;
}
