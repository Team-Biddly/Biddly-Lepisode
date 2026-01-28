import { ApiProperty } from '@nestjs/swagger';

export class PageInfoDTO {
  @ApiProperty({ description: '페이지 번호' })
  pageNo: number;
  @ApiProperty({ description: '페이지 크기' })
  pageSize: number;
  @ApiProperty({ description: '페이지 내 항목 수' })
  pageItems: number;
  @ApiProperty({ description: '총 항목 수' })
  totalItems: number;
  @ApiProperty({ description: '총 페이지' })
  totalPages: number;
}
