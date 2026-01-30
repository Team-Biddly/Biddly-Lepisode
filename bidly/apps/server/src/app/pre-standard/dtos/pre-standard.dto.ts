import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PreStandardOpinionDTO } from './pre-standard-opinion.dto';

@Exclude()
export class PreStandardDTO {
  @ApiProperty({
    description: 'ID',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: '키워드',
    type: [String],
  })
  @Expose()
  keywords: string[];

  @ApiProperty({
    description: '생성일',
  })
  @Expose({ groups: ['detail'] })
  createdAt: Date;

  @ApiProperty({
    description: '업무구분명',
  })
  @Expose()
  업무구분명: string;

  @ApiProperty({
    description: '참조번호',
  })
  @Expose({ groups: ['detail'] })
  참조번호: string;

  @ApiProperty({
    description: '품명',
  })
  @Expose()
  품명: string;

  @ApiProperty({
    description: '발주기관명',
  })
  @Expose()
  발주기관명: string;

  @ApiProperty({
    description: '실수요기관명',
  })
  @Expose()
  실수요기관명: string;

  @ApiProperty({
    description: '배정예산금액',
    type: 'string',
  })
  @Expose()
  배정예산금액: bigint;

  @ApiProperty({
    description: '접수일시',
  })
  @Expose()
  접수일시: Date;

  @ApiProperty({
    description: '의견등록마감일시',
  })
  @Expose({ groups: ['detail'] })
  의견등록마감일시: Date;

  @ApiProperty({
    description: '담당자전화번호',
  })
  @Expose({ groups: ['detail'] })
  담당자전화번호: string;

  @ApiProperty({
    description: '담당자명',
  })
  @Expose()
  담당자명: string;

  @ApiProperty({
    description: 'SW사업대상여부',
  })
  @Expose({ groups: ['detail'] })
  SW사업대상여부: boolean;

  @ApiProperty({
    description: '납품기한일시',
    required: false,
  })
  @Expose({ groups: ['detail'] })
  납품기한일시?: Date;

  @ApiProperty({
    description: '납품일수',
    required: false,
  })
  @Expose({ groups: ['detail'] })
  납품일수?: number;

  @ApiProperty({
    description: '사전규격등록번호',
  })
  @Expose({ groups: ['detail'] })
  사전규격등록번호: string;

  @ApiProperty({
    description: '규격문서파일URL',
    type: [String],
  })
  @Expose({ groups: ['detail'] })
  규격문서파일URL: string[];

  @ApiProperty({
    description: '물품상세목록',
    type: [String],
  })
  @Expose({ groups: ['detail'] })
  물품상세목록: string[];

  @ApiProperty({
    description: '등록일시',
  })
  @Expose()
  등록일시: Date;

  @ApiProperty({
    description: '입찰공고번호목록',
    type: [String],
  })
  @Expose({ groups: ['detail'] })
  입찰공고번호목록: string[];

  @ApiProperty({
    description: '의견목록',
    type: [PreStandardOpinionDTO],
  })
  @Expose({ groups: ['detail'] })
  의견목록: PreStandardOpinionDTO[];
}
