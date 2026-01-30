import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BidDTO } from './bid.dto';

export class BidEtcDTO extends BidDTO {
  @ApiProperty({
    description: '입찰참가자격내용',
    nullable: true,
  })
  @Expose()
  입찰참가자격내용?: string;

  @ApiProperty({
    description: '비고내용',
    nullable: true,
  })
  @Expose()
  비고내용?: string;

  @ApiProperty({
    description: '추정가격',
    nullable: true,
  })
  @Expose()
  추정가격?: bigint;

  @ApiProperty({
    description: '입찰참가수수료',
    nullable: true,
  })
  @Expose()
  입찰참가수수료?: bigint;

  @ApiProperty({
    description: '입찰보증금납부대상여부',
  })
  @Expose()
  입찰보증금납부대상여부: boolean;

  @ApiProperty({
    description: '공동수급여부',
  })
  @Expose()
  공동수급여부: boolean;
}
