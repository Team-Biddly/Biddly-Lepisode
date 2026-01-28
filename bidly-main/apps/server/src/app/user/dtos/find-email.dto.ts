import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider } from '@prisma/client';

export class FindEmailResponseDTO {
  @ApiProperty({
    description: '이메일',
  })
  email: string;

  @ApiProperty({
    description: '등록 일자',
  })
  createdAt: Date;

  @ApiProperty({
    description: '제공자',
    enum: Object.keys(AuthProvider),
  })
  provider: keyof typeof AuthProvider;
}
