import { ApiProperty } from '@nestjs/swagger';

export class FileInfoResponseDto {
  @ApiProperty({ description: 'The filename extracted from the URL' })
  filename!: string;
}
