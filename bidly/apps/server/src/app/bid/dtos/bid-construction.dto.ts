import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BidDTO } from './bid.dto';

export class BidConstructionDTO extends BidDTO {
  @ApiProperty({
    description: '예산금액',
  })
  @Expose()
  예산금액: bigint;

  @ApiProperty({
    description: '관급금액',
  })
  @Expose()
  관급금액: bigint;

  @ApiProperty({
    description: '적용기준내용',
  })
  @Expose()
  적용기준내용: string;

  @ApiProperty({
    description: '업종평가비율',
    nullable: true,
  })
  @Expose()
  업종평가비율?: number;

  @ApiProperty({
    description: '주공종명',
  })
  @Expose()
  주공종명: string;

  @ApiProperty({
    description: '주공종공사예정금액',
    nullable: true,
  })
  @Expose()
  주공종공사예정금액?: bigint;

  @ApiProperty({
    description: '가산지역명',
    type: [String],
  })
  @Expose()
  가산지역명: string[];

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
    description: '도급자설치관급자재금액',
    nullable: true,
  })
  @Expose()
  도급자설치관급자재금액?: bigint;

  @ApiProperty({
    description: '관급자설치관급자재금액',
    nullable: true,
  })
  @Expose()
  관급자설치관급자재금액?: bigint;

  @ApiProperty({
    description: '입찰참가수수료',
    nullable: true,
  })
  @Expose()
  입찰참가수수료?: bigint;

  @ApiProperty({
    description: '공동수급업체수',
    nullable: true,
  })
  @Expose()
  공동수급업체수?: number;

  @ApiProperty({
    description: '현장설명서URL',
    type: [String],
  })
  @Expose()
  현장설명서URL: string[];

  @ApiProperty({
    description: '부대공종명',
    type: [String],
  })
  @Expose()
  부대공종명: string[];

  @ApiProperty({
    description: '부공종업종평가비율',
    type: [Number],
  })
  @Expose()
  부공종업종평가비율: number[];

  @ApiProperty({
    description: '공동수급방식명',
  })
  @Expose()
  공동수급방식명: string;

  @ApiProperty({
    description: '공종별지분율목록',
  })
  @Expose()
  공종별지분율목록: string;

  @ApiProperty({
    description: '시공능력평가금액목록',
  })
  @Expose()
  시공능력평가금액목록: string;

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
    description: '공고설명여부',
  })
  @Expose()
  공고설명여부: boolean;

  @ApiProperty({
    description: '주공종추정가격',
    nullable: true,
  })
  @Expose()
  주공종추정가격?: bigint;

  @ApiProperty({
    description: '공사현장지역명',
  })
  @Expose()
  공사현장지역명: string;

  @ApiProperty({
    description: '지역의무공동도급여부',
  })
  @Expose()
  지역의무공동도급여부: boolean;

  @ApiProperty({
    description: '건설산업법적용대상여부',
  })
  @Expose()
  건설산업법적용대상여부: boolean;

  @ApiProperty({
    description: '상호시장진출허용여부',
  })
  @Expose()
  상호시장진출허용여부: boolean;

  @ApiProperty({
    description: '건설산업법적용대상공사명',
  })
  @Expose()
  건설산업법적용대상공사명: string;

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
    description: '주력분야평가여부',
  })
  @Expose()
  주력분야평가여부: boolean;

  @ApiProperty({
    description: '입찰보증서접수마감일시',
    nullable: true,
  })
  @Expose()
  입찰보증서접수마감일시?: Date;

  @ApiProperty({
    description: '지역의무공동도급비율',
  })
  @Expose()
  지역의무공동도급비율: number;

  @ApiProperty({
    description: '내역입찰여부',
  })
  @Expose()
  내역입찰여부: boolean;

  @ApiProperty({
    description: '공동수급업체지역제한여부',
  })
  @Expose()
  공동수급업체지역제한여부: boolean;
}
