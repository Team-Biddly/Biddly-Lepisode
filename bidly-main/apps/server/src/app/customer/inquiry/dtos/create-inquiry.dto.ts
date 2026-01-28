import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateInquiryDTO {
  @ApiProperty({ description: '문의 제목' })
  @IsNotEmpty({ message: '문의 제목을 입력해 주세요.' })
  title: string;

  @ApiProperty({ description: '문의 내용' })
  @IsNotEmpty({ message: '문의 내용을 입력해 주세요.' })
  content: string;
}
