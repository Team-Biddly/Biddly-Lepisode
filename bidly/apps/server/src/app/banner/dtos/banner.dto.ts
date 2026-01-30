import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FileDTO } from '../../storage/dtos/file.dto';
import { UserDTO } from '../../user/dtos/user.dto';

@Exclude()
export class BannerDTO {
  @ApiProperty({
    description: 'rowNumber',
  })
  @Expose()
  rowNumber?: string;

  @ApiProperty({
    description: '배너 ID',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: '텍스트컬러',
  })
  @Expose()
  textColor?: string;

  @ApiProperty({
    description: '정렬 순서',
    type: Number,
  })
  @Expose()
  order: number;

  @ApiProperty({
    description: '노출 여부',
    type: Boolean,
  })
  @Expose()
  isExposed?: boolean;

  @ApiProperty({
    description: '제목',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'URL',
  })
  @Expose()
  url?: string;

  @ApiProperty({
    description: '모드(웹용/모바일용)',
  })
  @Expose()
  mode?: string;

  @ApiProperty({
    description: '생성일',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  createdAt?: Date;

  @ApiProperty({
    description: '수정일',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    description: '배너 pc 이미지',
    type: () => FileDTO,
  })
  @Expose()
  @Type(() => FileDTO)
  pcImage: FileDTO;

  @ApiProperty({
    description: '배너 모바일 이미지',
    type: () => FileDTO,
  })
  @Expose()
  @Type(() => FileDTO)
  mobileImage: FileDTO;

  @ApiProperty({
    description: '작성자',
    type: () => UserDTO,
  })
  @Expose()
  @Type(() => UserDTO)
  admin?: UserDTO;

  constructor() {
    this.id = '';
    this.textColor = '';
    this.order = 0;
    this.isExposed = true;
    this.title = '';
    this.url = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.pcImage = undefined;
    this.mobileImage = undefined;
  }
}
