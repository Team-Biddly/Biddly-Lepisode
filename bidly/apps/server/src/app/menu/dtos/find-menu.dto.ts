import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindMenuDTO {
  @ApiProperty({
    required: false,
    description: '검색어',
    type: String,
  })
  @IsOptional()
  query: string;

  @ApiProperty({
    required: false,
    description: '메뉴 ID',
    type: String,
  })
  @IsOptional()
  id: string;
}
