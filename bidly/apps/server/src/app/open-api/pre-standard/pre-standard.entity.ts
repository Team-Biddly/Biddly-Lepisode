import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { OpenAPIEntity } from '../openapi.entity.abstract.class';
import { PreStandard_Construction } from './types/pre-standard-construction.type';
import { OpenAPIPreStandardForeign } from './types/pre-standard-foreign.type';
import { PreStandard_Service } from './types/pre-standard-service.type';
import { PreStandard_Thing } from './types/pre-standard-thing.type';

export class PreStandardEntity extends OpenAPIEntity {
  constructor(
    private readonly data:
      | PreStandard_Construction
      | OpenAPIPreStandardForeign
      | PreStandard_Thing
      | PreStandard_Service,
  ) {
    super();
  }

  toCreateInput(): Prisma.PreStandardCreateInput {
    return {
      id: this.data.bfSpecRgstNo,
      업무구분명: this.data.bsnsDivNm,
      참조번호: this.data.refNo,
      품명: this.data.prdctClsfcNoNm,
      발주기관명: this.data.orderInsttNm,
      실수요기관명: this.data.rlDminsttNm,
      배정예산금액: parseInt(this.data.asignBdgtAmt),
      접수일시: dayjs(this.data.rcptDt).toDate(),
      의견등록마감일시: dayjs(this.data.opninRgstClseDt).toDate(),
      담당자전화번호: this.data.ofclTelNo,
      담당자명: this.data.ofclNm,
      SW사업대상여부: this.data.swBizObjYn === 'Y',
      납품기한일시:
        this.data.dlvrTmlmtDt !== ''
          ? dayjs(this.data.dlvrTmlmtDt).toDate()
          : null,
      납품일수: parseInt(this.data.dlvrDaynum),
      사전규격등록번호: this.data.bfSpecRgstNo,
      규격문서파일URL: [
        this.data.specDocFileUrl1,
        this.data.specDocFileUrl2,
        this.data.specDocFileUrl3,
        this.data.specDocFileUrl4,
        this.data.specDocFileUrl5,
      ]
        .filter((i) => i !== '')
        .filter((i) => i !== '추후제공'),
      물품상세목록:
        'prdctDtlList' in this.data && this.data.prdctDtlList
          ? this.data.prdctDtlList.split(',')
          : [],
      등록일시: dayjs(this.data.rgstDt).toDate(),
      입찰공고번호목록: this.data.bidNtceNoList.split(','),
    };
  }
}
