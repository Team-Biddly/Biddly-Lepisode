import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BidDTO } from './bid.dto';

export class BidThingDTO extends BidDTO {
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
    description: '배정예산금액',
    nullable: true,
  })
  @Expose()
  배정예산금액?: bigint;

  @ApiProperty({
    description: '세부품명번호',
  })
  @Expose()
  세부품명번호: string;

  @ApiProperty({
    description: '세부품명',
  })
  @Expose()
  세부품명: string;

  @ApiProperty({
    description: '물품규격명',
  })
  @Expose()
  물품규격명: string;

  @ApiProperty({
    description: '물품수량',
  })
  @Expose()
  물품수량?: number;

  @ApiProperty({
    description: '물품단위',
  })
  @Expose()
  물품단위: string;

  @ApiProperty({
    description: '물품단가',
  })
  @Expose()
  물품단가: bigint;

  @ApiProperty({
    description: '납품기한일시',
    nullable: true,
  })
  @Expose()
  납품기한일시?: Date;

  @ApiProperty({
    description: '납품일수',
    nullable: true,
  })
  @Expose()
  납품일수?: number;

  @ApiProperty({
    description: '인도조건명',
  })
  @Expose()
  인도조건명: string;

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
    description: '입찰참가수수료',
    nullable: true,
  })
  @Expose()
  입찰참가수수료?: bigint;
}
