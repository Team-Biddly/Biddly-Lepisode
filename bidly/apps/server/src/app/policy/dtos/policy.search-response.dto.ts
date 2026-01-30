import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PolicyDTO } from './policy.dto';
import { OffsetPaginationDTO } from '../../../libs';

export class PolicySearchResponseDTO extends OffsetPaginationDTO<PolicyDTO> {
  @ApiProperty({
    type: () => PolicyDTO,
    isArray: true,
  })
  @Type(() => PolicyDTO)
  items: PolicyDTO[];

  constructor() {
    super();
    this.items = [];
  }
}
