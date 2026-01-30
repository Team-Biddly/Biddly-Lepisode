import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PageType } from '@common';

export class CreateMenuDTO {
  @IsNotEmpty({ message: '메뉴명을 입력해주세요.' })
  @ApiProperty({ description: '메뉴명', example: '메뉴명' })
  name: string;

  @IsOptional()
  @ApiProperty({ description: '라우트 URL', example: '라우트 URL' })
  routeUrl: string;

  @IsOptional()
  @ApiProperty({ description: 'api URL', example: 'api URL' })
  apiUrl: string;

  @IsOptional()
  @ApiProperty({ description: '페이지 유형', enum: Object.keys(PageType) })
  pageType: keyof typeof PageType;

  @ApiProperty({ description: '상위 메뉴 ID', required: false })
  @IsOptional()
  parentId?: string;
}
