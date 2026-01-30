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
  name?: string;

  @ApiProperty({
    description: '전화번호',
    example: '01012345678',
  })
  @IsNotEmpty({ message: '전화번호를 입력해 주세요.' })
  @MaxLength(11, { message: '전화번호는 11자 이하로 입력해 주세요.' })
  @IsPhoneNumber('KR', { message: '전화번호 형식이 올바르지 않습니다.' })
  contact: string;

  constructor() {
    this.name = '';
    this.contact = '';
  }
}
