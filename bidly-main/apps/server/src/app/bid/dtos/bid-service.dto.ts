import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BidDTO } from './bid.dto';

export class BidServiceDTO extends BidDTO {


  @ApiProperty({
    description: 'PQ신청서접수방법명',
  })
  @Expose()
  PQ신청서접수방법명: string;

  @ApiProperty({
    description: 'PQ신청서접수일시',
    nullable: true,
  })
  @Expose()
  PQ신청서접수일시?: Date;

  @ApiProperty({
    description: 'TP심사신청방법명',
  })
  @Expose()
  TP심사신청방법명: string;

  @ApiProperty({
    description: 'TP심사신청마감일시',
    nullable: true,
  })
  @Expose()
  TP심사신청마감일시?: Date;

  @ApiProperty({
    description: '공동도급의무지역명',
    type: [String],
  })
  @Expose()
  공동도급의무지역명: string[];

  @ApiProperty({
    description: '지역의무공동도급비율',
    nullable: true,
  })
  @Expose()
  지역의무공동도급비율?: number;

  @ApiProperty({
    description: '내역입찰여부',
  })
  @Expose()
  내역입찰여부: boolean;

  @ApiProperty({
    description: '입찰참가제한여부',
  })
  @Expose()
  입찰참가제한여부: boolean;

  @ApiProperty({
    description: '배정예산금액',
    nullable: true,
  })
  @Expose()
  배정예산금액?: bigint;

  @ApiProperty({
    description: '설명회실시일시',
    nullable: true,
  })
  @Expose()
  설명회실시일시?: Date;

  @ApiProperty({
    description: '설명회실시장소',
  })
  @Expose()
  설명회실시장소: string;

  @ApiProperty({
    description: '입찰참가수수료',
    nullable: true,
  })
  @Expose()
  입찰참가수수료?: bigint;

  @ApiProperty({
    description: '조달청일반용역여부',
  })
  @Expose()
  조달청일반용역여부: boolean;

  @ApiProperty({
    description: '용역구분명',
  })
  @Expose()
  용역구분명: string;

  @ApiProperty({
    description: '물품분류제한여부',
  })
  @Expose()
  물품분류제한여부: boolean;

  @ApiProperty({
    description: '제조여부',
  })
  @Expose()
  제조여부: boolean;

  @ApiProperty({
    description: '구매대상물품목록',
    type: [String],
  })
  @Expose()
  구매대상물품목록: string[];

  @ApiProperty({
    description: '공동수급구성방식명',
  })
  @Expose()
  공동수급구성방식명: string;

  @ApiProperty({
    description: '실적경쟁여부',
  })
  @Expose()
  실적경쟁여부: boolean;

  @ApiProperty({
    description: 'PQ심사여부',
  })
  @Expose()
  PQ심사여부: boolean;

  @ApiProperty({
    description: 'TP심사여부',
  })
  @Expose()
  TP심사여부: boolean;

  @ApiProperty({
    description: '공고설명여부',
  })
  @Expose()
  공고설명여부: boolean;

  @ApiProperty({
    description: '정보화사업여부',
  })
  @Expose()
  정보화사업여부: boolean;

  @ApiProperty({
    description: '부가가치세',
  })
  @Expose()
  부가가치세: bigint;

  @ApiProperty({
    description: '주공종부가가치세',
    nullable: true,
  })
  @Expose()
  주공종부가가치세?: bigint;

  @ApiProperty({
    description: '공공조달대분류명',
  })
  @Expose()
  공공조달대분류명: string;

  @ApiProperty({
    description: '공공조달중분류명',
  })
  @Expose()
  공공조달중분류명: string;

  @ApiProperty({
    description: '공공조달분류번호',
  })
  @Expose()
  공공조달분류번호: string;

  @ApiProperty({
    description: '공공조달분류명',
  })
  @Expose()
  공공조달분류명: string;
}
