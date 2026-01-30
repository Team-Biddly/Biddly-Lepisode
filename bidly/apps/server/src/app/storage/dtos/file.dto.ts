import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

@Exclude()
export class FileDTO {
  @ApiPropertyOptional({
    description: 'rowNumber',
  })
  @Expose()
  rowNumber: string | null;

  @ApiProperty({
    description: '파일 ID',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: '파일명',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'URL',
  })
  @Expose()
  url: string;

  @ApiProperty({
    description: 'MIME 타입',
  })
  @Expose()
  mimeType: string;

  @ApiProperty({
    description: '크기',
    type: Number,
  })
  @Expose()
  size: number;

  @ApiProperty({
    description: '문서제목',
  })
  @Expose()
  title: string | null;

  @ApiProperty({
    description: '타입',
  })
  @Expose()
  type: string;

  @ApiProperty({
    description: '문서내용',
  })
  @Expose()
  content: string | null;

  @ApiProperty({
    description: '상태',
  })
  @Expose()
  @Transform(() => 'SUCCESS')
  status: string;

  @ApiProperty({
    description: '생성일',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  @ApiPropertyOptional({
    description: '미션 ID',
  })
  @Expose()
  missionId: string | null;

  @ApiPropertyOptional({
    description: '기업 ID',
  })
  @Expose()
  companyId: string | null;

  @ApiPropertyOptional({
    description: '업로드한 사용자 ID',
  })
  @Expose()
  userId: string | null;

  @ApiPropertyOptional({
    description: '프로젝트 ID',
  })
  @Expose()
  ProjectId: string | null;

  @ApiPropertyOptional({
    description: '미션 정보 ID',
  })
  @Expose()
  missionInfoId: string | null;

  @ApiPropertyOptional({
    description: '미션 참여 정보 ID',
  })
  @Expose()
  missionParticipationId: string | null;

  @ApiPropertyOptional({
    description: '포인트샵 ID',
  })
  @Expose()
  pointShopId: string | null;

  @ApiPropertyOptional({
    description: '배너 ID',
  })
  @Expose()
  bannerId: string | null;

  constructor() {
    this.rowNumber = null;
    this.id = '';
    this.name = '';
    this.url = '';
    this.mimeType = '';
    this.size = 0;
    this.type = '';
    this.status = 'SUCCESS';
    this.title = null;
    this.content = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.missionId = null;
    this.companyId = null;
    this.userId = null;
    this.ProjectId = null;
    this.missionInfoId = null;
    this.missionParticipationId = null;
    this.pointShopId = null;
    this.bannerId = null;
  }
}
