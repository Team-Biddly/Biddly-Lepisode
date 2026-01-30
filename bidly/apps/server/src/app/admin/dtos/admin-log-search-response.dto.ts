import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OffsetPaginationDTO, PageInfoDTO } from '../../../libs';
import { AdminLogDTO } from './admin-log.dto';

export class AdminLogSearchResponseDTO extends OffsetPaginationDTO<AdminLogDTO> {
  @ApiProperty({
    type: AdminLogDTO,
    isArray: true,
  })
  @Type(() => AdminLogDTO)
  items: AdminLogDTO[];

  @ApiProperty({ type: PageInfoDTO })
  pageInfo: PageInfoDTO;
}
