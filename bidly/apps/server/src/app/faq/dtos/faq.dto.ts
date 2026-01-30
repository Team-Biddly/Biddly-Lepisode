import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { AdminDTO } from '../../admin/dtos/admin.dto';

@Exclude()
export class FaqDTO {
  @Expose()
  @ApiProperty({ description: 'rowNumber' })
  rowNumber: string;

  @Expose()
  @ApiProperty({ description: 'ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: '관리자' })
  admin: AdminDTO;

  @Expose()
  @ApiPropertyOptional({
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
    },
  })
  en?: {
    title: string;
    content: string;
  };

  @Expose()
  @ApiPropertyOptional({
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
    },
  })
  ja?: {
    title: string;
    content: string;
  };

  @Expose()
  @ApiProperty({ description: '제목' })
  title: string;

  @Expose()
  @ApiProperty({ description: '내용' })
  content: string;

  @Expose()
  @ApiProperty({ description: '핀 고정' })
  isPinned: boolean;

  @Expose()
  @ApiProperty({ description: '등록일', type: Date })
  @Type(() => Date)
  createdAt: Date;
}
