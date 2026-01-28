import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAdminDTO {
  @ApiProperty({
    description: '이메일 주소',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty({ message: '이메일 주소를 입력해 주세요.' })
  email: string;

  @ApiProperty({
    description: '비밀번호',
    type: String,
  })
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  password: string;

  @ApiProperty({
    description: '비밀번호 확인',
    type: String,
  })
  @IsNotEmpty({ message: '비밀번호 확인을 입력해 주세요.' })
  passwordConfirm: string;

  @ApiProperty({
    description: '관리자명',
    type: String,
  })
  @IsNotEmpty({ message: '관리자명을 입력해 주세요.' })
  name: string;
}
