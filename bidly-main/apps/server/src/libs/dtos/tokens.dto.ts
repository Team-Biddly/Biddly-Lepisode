import { ApiProperty } from '@nestjs/swagger';

export class TokenDTO {
  @ApiProperty({
    description: 'accessToken',
  })
  accessToken: string;

  @ApiProperty({
    description: 'refreshToken',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'provider',
  })
  provider?: string;

  constructor() {
    this.accessToken = '';
    this.refreshToken = '';
    this.provider = '';
  }
}
