import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthProvider } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class OauthCreateDTO {
  @ApiPropertyOptional({ description: 'providerId', required: false })
  @IsOptional({ message: 'providerId 를 입력해 주세요.' })
  providerId?: string;

  @ApiProperty({
    description: 'SNS 제공자',
    enum: Object.keys(AuthProvider),
    required: false,
  })
  @IsOptional({ message: 'providerId 를 입력해 주세요.' })
  provider: keyof typeof AuthProvider;

  @ApiProperty({
    description: 'email 제공자',
    required: false,
  })
  @IsOptional({ message: 'providerId 를 입력해 주세요.' })
  email: string;

  constructor() {
    this.provider = AuthProvider.EMAIL;
    this.providerId = '';
    this.email = '';
  }
}
