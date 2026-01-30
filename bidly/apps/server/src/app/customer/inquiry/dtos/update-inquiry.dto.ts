import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateInquiryDTO } from './create-inquiry.dto';

export class UpdateInquiryDTO extends PartialType(CreateInquiryDTO) {
  @ApiPropertyOptional({
    description: '문의 답변',
    required: false,
    nullable: true,
  })
  @IsOptional()
  answer?: string;
}
