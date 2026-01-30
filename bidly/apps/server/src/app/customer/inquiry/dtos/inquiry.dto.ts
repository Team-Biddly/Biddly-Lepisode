import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserDTO } from '../../../user/dtos/user.dto';

@Exclude()
export class InquiryDTO {
  @ApiProperty({ description: 'ID' })
  @Expose()
  id: string;

  @Expose()
  @ApiProperty({ description: '순번' })
  rowNumber: string;

  @ApiProperty({ description: '제목' })
  @Expose()
  title: string;

  @ApiProperty({ description: '내용' })
  @Expose()
  content: string;

  @ApiPropertyOptional({ description: '답변' })
  @Expose()
  answer?: string;

  @ApiPropertyOptional({ description: '답변일', type: Date })
  @Expose()
  answeredAt?: Date;

  @ApiProperty({ description: '생성일', type: Date })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: '수정일', type: Date })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({ description: '등록 회원', type: UserDTO })
  @Expose()
  @Type(() => UserDTO)
  user: UserDTO;
}
