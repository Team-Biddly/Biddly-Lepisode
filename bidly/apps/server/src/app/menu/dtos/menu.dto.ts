import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { MenuPermissionDTO } from './menu-permission.dto';
import { PageType } from '@common';

@Exclude()
export class MenuDTO {
  @ApiProperty({
    description: '메뉴 ID',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: '메뉴명',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: '라우트 URL',
  })
  @Expose()
  routeUrl: string;

  @ApiProperty({
    description: 'Api URL',
  })
  @Expose()
  apiUrl: string;

  @ApiProperty({
    description: '페이지 유형',
    enum: Object.keys(PageType),
  })
  @Expose()
  pageType: keyof typeof PageType;

  @ApiProperty({
    description: '메뉴 권한',
    type: () => MenuPermissionDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => MenuPermissionDTO)
  permissions: MenuPermissionDTO[];

  @ApiProperty({
    description: '자식 메뉴',
    type: () => MenuDTO,
    isArray: true,
  })
  @Expose()
  @Type(() => MenuDTO)
  children: MenuDTO[];

  @ApiProperty({
    description: '부모 메뉴',
    type: () => MenuDTO,
  })
  @Expose()
  @Type(() => MenuDTO)
  parent: MenuDTO;

  @ApiProperty({
    description: '부모 메뉴 ID',
  })
  @Expose()
  parentId: string;

  @ApiProperty({
    description: '메뉴 생성일',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '메뉴 수정일',
  })
  @Expose()
  updatedAt: Date;
}
