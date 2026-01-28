---
to: 'apps/server/src/libs/dtos/offset-pagination.dto.ts'
---

import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDTO } from './page-info.dto';

export class OffsetPaginationDTO {
  @ApiProperty({ isArray: true })
  items: any[];

  @ApiProperty({ type: PageInfoDTO })
  pageInfo: PageInfoDTO;
}
