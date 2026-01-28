import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendSMSDTO {
  @ApiProperty({
    description: '연락처',
  })
  @IsNotEmpty({
    message: '연락처를 입력해 주세요.',
  })
  contact: string;

  constructor() {
    this.contact = '';
  }
}
