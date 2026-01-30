import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class BannerReorderDTO {
  @ApiProperty({ description: 'prev' })
  @IsNotEmpty({ message: 'prev 를 입력해 주세요.' })
  prev: number;

  @ApiProperty({ description: 'current' })
  @IsNotEmpty({ message: 'current 를 입력해 주세요.' })
  current: number;

  @ApiPropertyOptional({ description: 'mode' })
  @IsOptional()
  mode?: string;

  constructor() {
    this.prev = 0;
    this.current = 0;
    this.mode = '웹용';
  }
}
