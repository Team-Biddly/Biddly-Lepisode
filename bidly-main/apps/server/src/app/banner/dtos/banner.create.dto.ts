import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FileConnectDTO } from '../../storage/dtos/file.connect.dto';
import { FileDTO } from '../../storage/dtos/file.dto';

export class BannerCreateDTO {
  @ApiProperty({
    description: '배너 제목',
    required: true,
  })
  @IsNotEmpty({
    message: '배너 제목을 입력해 주세요.',
  })
  title: string;

  @ApiPropertyOptional({
    description: '링크',
    required: false,
  })
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    description: '모드(웹용/모바일용)',
    required: false,
  })
  @IsOptional()
  mode?: string;

  @ApiProperty({
    description: '배너 pc 이미지',
    type: () => FileDTO,
  })
  @IsOptional()
  pcImage?: FileDTO;

  @ApiProperty({
    description: '배너 모바일 이미지',
    type: () => FileDTO,
  })
  @IsOptional()
  mobileImage?: FileDTO;

  @ApiPropertyOptional({
    description: '정렬 순서',
    required: false,
    type: Number,
  })
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({
    description: '노출 여부',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  isExposed?: boolean;

  constructor() {
    this.title = '';
    this.order = 0;
    this.isExposed = true;
    this.url = '';
    this.pcImage = undefined;
    this.mobileImage = undefined;
  }
}
