import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OffsetPaginationDTO, PageInfoDTO } from '../../../libs';
import { FaqDTO } from './faq.dto';

export class FaqSearchResponseDTO extends OffsetPaginationDTO<FaqDTO> {
  @ApiProperty({ type: FaqDTO, isArray: true })
  @Type(() => FaqDTO)
  declare items: FaqDTO[];

  @ApiProperty({ type: PageInfoDTO })
  declare pageInfo: PageInfoDTO;
}
