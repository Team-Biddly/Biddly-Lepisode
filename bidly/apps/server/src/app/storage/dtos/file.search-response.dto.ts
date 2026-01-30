import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FileDTO } from './file.dto';
import { OffsetPaginationDTO } from '../../../libs';

@Exclude()
export class FileSearchResponseDTO extends OffsetPaginationDTO<FileDTO> {
  @ApiProperty({
    type: () => FileDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => FileDTO)
  items: FileDTO[];

  constructor() {
    super();
    this.items = [];
  }
}
