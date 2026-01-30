---
to: 'apps/server/src/libs/dtos/cursor-pagination.dto.ts'
---
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CursorPaginationDTO {
  @ApiProperty({ isArray: true })
  items: any[];

  @ApiPropertyOptional({ description: "다음 커서" })
  nextCursor?: string;

  @ApiProperty({ description: "다음 페이지 존재 여부" })
  hasNext: boolean;
}
