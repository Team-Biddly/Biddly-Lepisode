import { ApiProperty } from '@nestjs/swagger';

export class SendSMSResponseDTO {
  @ApiProperty({
    description: 'token',
  })
  token: string;

  constructor() {
    this.token = '';
  }
}
