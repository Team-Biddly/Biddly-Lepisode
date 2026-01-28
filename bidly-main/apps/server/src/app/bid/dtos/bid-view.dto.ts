import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class BidViewDTO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    switch (obj.type) {
      case 'construction':
        return '공사';
      case 'foreign':
        return '외자';
      case 'service':
        return '용역';
      case 'thing':
        return '물품';
    }
  })
  업무구분명: string;

  @ApiProperty()
  @Expose({ name: 'keywords' })
  키워드: string[];

  @ApiProperty()
  @Expose()
  입찰공고명: string;

  @ApiPropertyOptional()
  @Expose()
  입찰개시일시?: Date;

  @ApiPropertyOptional()
  @Expose()
  @Transform(({ value }) => (value ? BigInt(value).toJSON() : null))
  배정예산금액?: number;

  @ApiProperty()
  @Expose()
  공고기관명: string;

  @ApiProperty()
  @Expose()
  수요기관명: string;

  @ApiProperty()
  @Expose()
  공고기관담당자명: string;

  @ApiProperty()
  입찰방식명: string;

  @ApiProperty()
  @Expose()
  공고종류명: string;

  @ApiProperty()
  @Expose()
  모의공고여부: boolean;

  @ApiProperty()
  @Expose()
  등록일시: Date;

  @ApiProperty()
  공고규격서URL: string[];
}
