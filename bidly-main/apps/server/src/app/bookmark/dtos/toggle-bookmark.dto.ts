import { ApiProperty } from '@nestjs/swagger';
import { BookmarkModelName } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class ToggleBookmarkDTO {
  @ApiProperty({ enum: BookmarkModelName })
  @IsNotEmpty()
  modelName: BookmarkModelName;

  @ApiProperty()
  @IsNotEmpty()
  modelId: string;
}
