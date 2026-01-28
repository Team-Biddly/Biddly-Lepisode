import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OrderPlanDTO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: [String] })
  @Expose()
  keywords: string[];

  @ApiProperty()
  @Expose({ groups: ['detail'] })
  createdAt: Date;

  @ApiProperty()
  @Expose({ groups: ['detail'] })
  updatedAt: Date;

  @ApiProperty()
  @Expose({ groups: ['detail'] })
  업무구분코드: string;
  @ApiProperty()
  @Expose()
  업무구분명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  업무유형코드: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  업무유형명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  발주년도: number;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  발주기관코드: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  총괄기관명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  소관구분코드: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  소관구분명: string;
  @ApiProperty()
  @Expose()
  발주기관명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  발주계획순번: number;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  조달방식: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  발주월: string;
  @ApiProperty()
  @Expose()
  사업명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  공사지역명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  공종구분명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  계약방법명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  발주도급금액: number;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  발주관급자재비: number;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  발주기타금액: number;
  @ApiProperty()
  @Expose()
  합계발주금액: number;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  부서명: string;
  @ApiProperty()
  @Expose()
  담당자명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  전화번호: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  협정여부: boolean;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  용도내용: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  수량내용: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  단위: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  물품분류번호: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  세부품명번호: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  품명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  공고게시여부: boolean;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  합계발주미화금액: number;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  모집등록번호: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  규격항목: Record<string, string>;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  예산구분코드: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  공사기간내용: string;
  @ApiProperty()
  @Expose()
  게시일시: Date;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  발주금차도급금액: number;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  발주국고보조금액: number;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  세부품명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  규격내용: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  설계문서열람장소명: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  설계문서열람기간내용: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  비고내용: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  발주계획통합번호: string;
  @ApiProperty()
  @Expose({ groups: ['detail'] })
  입찰공고번호목록: string;
}
