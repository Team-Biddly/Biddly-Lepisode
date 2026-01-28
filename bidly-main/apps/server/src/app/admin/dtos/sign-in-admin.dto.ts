import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInAdminDTO {
  @ApiProperty({
    description: '이메일',
    example: 'admin',
  })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'admin',
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
