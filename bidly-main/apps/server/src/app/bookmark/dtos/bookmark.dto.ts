import { ApiProperty } from '@nestjs/swagger';
import { BookmarkModelName } from '@prisma/client';
import { Expose } from 'class-transformer';

export class BookmarkDTO {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty({ enum: BookmarkModelName })
  @Expose()
  modelName: BookmarkModelName;
  @ApiProperty()
  @Expose()
  modelId: string;
  @ApiProperty()
  @Expose()
  createdAt: Date;
}
