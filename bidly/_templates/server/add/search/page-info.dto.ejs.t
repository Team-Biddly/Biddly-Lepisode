---
to: 'apps/server/src/libs/dtos/page-info.dto.ts'
---
import { ApiProperty } from "@nestjs/swagger";

export class PageInfoDTO {
  @ApiProperty({ description: "페이지 번호", required: false })
  pageNo: number;
  @ApiProperty({ description: "페이지 크기", required: false })
  pageSize: number;
  @ApiProperty({ description: "페이지 내 항목 수", required: false })
  pageItems: number;
  @ApiProperty({ description: "총 항목 수", required: false })
  totalItems: number;
  @ApiProperty({ description: "총 페이지", required: false })
  totalPages: number;
}
