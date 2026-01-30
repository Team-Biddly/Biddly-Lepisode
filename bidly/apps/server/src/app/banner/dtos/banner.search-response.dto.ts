import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BannerDTO } from './banner.dto';
import { OffsetPaginationDTO } from '../../../libs';

export class BannerSearchResponseDTO extends OffsetPaginationDTO<BannerDTO> {
  @ApiProperty({
    type: () => BannerDTO,
    isArray: true,
  })
  @Type(() => BannerDTO)
  items: BannerDTO[];

  constructor() {
    super();
    this.items = [];
  }
}
