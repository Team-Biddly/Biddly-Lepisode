import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CursorPaginationDTO<T> {
  @ApiProperty({ isArray: true })
  items: T[];

  @ApiPropertyOptional({ description: '다음 커서' })
  nextCursor?: string;

  @ApiProperty({ description: '다음 페이지 존재 여부' })
  hasNext: boolean;
}
