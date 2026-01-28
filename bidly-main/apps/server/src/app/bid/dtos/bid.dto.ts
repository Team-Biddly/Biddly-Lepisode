import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BidDTO {
  @ApiProperty({
    description: '입찰 공고 ID',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: '유형',
  })
  @Expose()
  type: string;

  @ApiProperty({ description: '키워드' })
  @Expose()
  keywords: string[];

  @ApiProperty({
    description: '생성 일시',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '수정 일시',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: '입찰공고차수',
  })
  @Expose()
  입찰공고차수: number;

  @ApiProperty({
    description: '재공고여부',
  })
  @Expose()
  재공고여부: boolean;

  @ApiProperty({
    description: '등록유형명',
  })
  @Expose()
  등록유형명: string;

  @ApiProperty({
    description: '공고종류명',
  })
  @Expose()
  공고종류명: string;

  @ApiProperty({
    description: '국제입찰여부',
  })
  @Expose()
  국제입찰여부: boolean;

  @ApiProperty({
    description: '입찰공고일시',
  })
  @Expose()
  입찰공고일시: Date;

  @ApiProperty({
    description: '참조번호',
  })
  @Expose()
  참조번호: string;

  @ApiProperty({
    description: '입찰공고명',
  })
  @Expose()
  입찰공고명: string;

  @ApiProperty({
    description: '공고기관코드',
  })
  @Expose()
  공고기관코드: string;

  @ApiProperty({
    description: '공고기관명',
  })
  @Expose()
  공고기관명: string;

  @ApiProperty({
    description: '수요기관코드',
  })
  @Expose()
  수요기관코드: string;

  @ApiProperty({
    description: '수요기관명',
  })
  @Expose()
  수요기관명: string;

  @ApiProperty({
    description: '입찰방식명',
  })
  @Expose()
  입찰방식명: string;

  @ApiProperty({
    description: '계약체결방법명',
  })
  @Expose()
  계약체결방법명: string;

  @ApiProperty({
    description: '공고기관담당자명',
  })
  @Expose()
  공고기관담당자명: string;

  @ApiProperty({
    description: '공고기관담당자전화번호',
  })
  @Expose()
  공고기관담당자전화번호: string;

  @ApiProperty({
    description: '공고기관담당자이메일주소',
  })
  @Expose()
  공고기관담당자이메일주소: string;

  @ApiProperty({
    description: '집행관명',
  })
  @Expose()
  집행관명: string;

  @ApiProperty({
    description: '입찰참가자격등록마감일시',
    nullable: true,
  })
  @Expose()
  입찰참가자격등록마감일시?: Date;

  @ApiProperty({
    description: '공동수급협정서접수방식',
  })
  @Expose()
  공동수급협정서접수방식: string;

  @ApiProperty({
    description: '공동수급협정마감일시',
    nullable: true,
  })
  @Expose()
  공동수급협정마감일시?: Date;

  @ApiProperty({
    description: '공동수급업체지역제한여부',
  })
  @Expose()
  공동수급업체지역제한여부: boolean;

  @ApiProperty({
    description: '입찰개시일시',
    nullable: true,
  })
  @Expose()
  입찰개시일시?: Date;

  @ApiProperty({
    description: '입찰마감일시',
    nullable: true,
  })
  @Expose()
  입찰마감일시?: Date;

  @ApiProperty({
    description: '개찰일시',
  })
  @Expose()
  개찰일시: Date;

  @ApiProperty({
    description: '공고규격서URL',
    type: [String],
  })
  @Expose()
  공고규격서URL: string[];

  @ApiProperty({
    description: '공고규격파일명',
    type: [String],
  })
  @Expose()
  공고규격파일명: string[];

  @ApiProperty({
    description: '재입찰허용여부',
  })
  @Expose()
  재입찰허용여부: boolean;

  @ApiProperty({
    description: '예정가격결정방법명',
  })
  @Expose()
  예정가격결정방법명: string;

  @ApiProperty({
    description: '총예가건수',
    nullable: true,
  })
  @Expose()
  총예가건수?: number;

  @ApiProperty({
    description: '추첨예가건수',
    nullable: true,
  })
  @Expose()
  추첨예가건수?: number;

  @ApiProperty({
    description: '추정가격',
    nullable: true,
  })
  @Expose()
  추정가격?: bigint;

  @ApiProperty({
    description: '개찰장소',
  })
  @Expose()
  개찰장소: string;

  @ApiProperty({
    description: '입찰공고상세URL',
  })
  @Expose()
  입찰공고상세URL: string;

  @ApiProperty({
    description: '입찰공고URL',
  })
  @Expose()
  입찰공고URL: string;

  @ApiProperty({
    description: '입찰참가수수료납부여부',
  })
  @Expose()
  입찰참가수수료납부여부: string;

  @ApiProperty({
    description: '입찰보증금납부여부',
  })
  @Expose()
  입찰보증금납부여부: boolean;

  @ApiProperty({
    description: '채권자명',
  })
  @Expose()
  채권자명: string;

  @ApiProperty({
    description: '통합공고번호',
  })
  @Expose()
  통합공고번호: string;

  @ApiProperty({
    description: '공동수급방식코드',
  })
  @Expose()
  공동수급방식코드: string;

  @ApiProperty({
    description: '표준공고서URL',
  })
  @Expose()
  표준공고서URL: string;

  @ApiProperty({
    description: '지사투찰허용여부',
  })
  @Expose()
  지사투찰허용여부: boolean;

  @ApiProperty({
    description: '지명경쟁여부',
  })
  @Expose()
  지명경쟁여부: boolean;

  @ApiProperty({
    description: '예비가격재작성방법명',
  })
  @Expose()
  예비가격재작성방법명: string;

  @ApiProperty({
    description: '실적신청서접수방법명',
  })
  @Expose()
  실적신청서접수방법명: string;

  @ApiProperty({
    description: '실적신청서접수일시',
    nullable: true,
  })
  @Expose()
  실적신청서접수일시?: Date;

  @ApiProperty({
    description: '발주계획통합번호',
  })
  @Expose()
  발주계획통합번호: string;

  @ApiProperty({
    description: '낙찰하한율',
    nullable: true,
  })
  @Expose()
  낙찰하한율?: number;

  @ApiProperty({
    description: '등록일시',
  })
  @Expose()
  등록일시: Date;

  @ApiProperty({
    description: '사전규격등록번호',
  })
  @Expose()
  사전규격등록번호: string;

  @ApiProperty({
    description: '낙찰방법코드',
  })
  @Expose()
  낙찰방법코드: string;

  @ApiProperty({
    description: '낙찰방법명',
  })
  @Expose()
  낙찰방법명: string;

  @ApiProperty({
    description: '수요기관담당자이메일주소',
  })
  @Expose()
  수요기관담당자이메일주소: string;

  @ApiProperty({
    description: '업종제한여부',
  })
  @Expose()
  업종제한여부: boolean;

  @ApiProperty({
    description: '변경공고사유',
  })
  @Expose()
  변경공고사유: string;

  @ApiProperty({
    description: '재입찰개찰일시',
  })
  @Expose()
  재입찰개찰일시: Date;
}
