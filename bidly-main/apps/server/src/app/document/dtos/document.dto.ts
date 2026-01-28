import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DocumentDTO {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  type: DocumentType;
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  createdAt: Date;
}
