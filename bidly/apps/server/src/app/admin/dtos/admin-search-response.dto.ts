import { ApiProperty } from '@nestjs/swagger';
import { OffsetPaginationDTO, PageInfoDTO } from '../../../libs';
import { AdminDTO } from './admin.dto';
import { Type } from 'class-transformer';

export class AdminSearchResponseDTO extends OffsetPaginationDTO<AdminDTO> {
  @ApiProperty({
    type: AdminDTO,
    isArray: true,
  })
  @Type(() => AdminDTO)
  items: AdminDTO[];

  @ApiProperty({ type: PageInfoDTO })
  pageInfo: PageInfoDTO;
}
