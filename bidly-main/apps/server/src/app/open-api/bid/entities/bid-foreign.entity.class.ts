import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { Bid_Foreign } from '../types/bid-foreign.type';
import { OpenAPIEntity } from '../../openapi.entity.abstract.class';

export class BidForeignEntity extends OpenAPIEntity {
  constructor(private data: Bid_Foreign) {
    super();
  }

  toCreateInput(): Prisma.Bid_ForeignCreateInput {
    return {
      id: this.data.bidNtceNo,
      입찰공고명: this.data.bidNtceNm,
      입찰공고차수: parseInt(this.data.bidNtceOrd),
      재공고여부: this.data.reNtceYn === 'Y',
      등록유형명: this.data.rgstTyNm,
      공고종류명: this.data.ntceKindNm,
      국제입찰여부: this.data.intrbidYn === 'Y',
      입찰공고일시:
        this.data.bidNtceDt !== '' ? dayjs(this.data.bidNtceDt).toDate() : null,
      참조번호: this.data.refNo,
      공고기관코드: this.data.ntceInsttCd,
      공고기관명: this.data.ntceInsttNm,
      수요기관코드: this.data.dminsttCd,
      수요기관명: this.data.dminsttNm,
      입찰방식명: this.data.bidMethdNm,
      계약체결방법명: this.data.cntrctCnclsMthdNm,
      공고기관담당자명: this.data.ntceInsttOfclNm,
      공고기관담당자전화번호: this.data.ntceInsttOfclTelNo,
      공고기관담당자이메일주소: this.data.ntceInsttOfclEmailAdrs,
      집행관명: this.data.exctvNm,
      입찰참가자격등록마감일시:
        this.data.bidQlfctRgstDt !== ''
          ? dayjs(this.data.bidQlfctRgstDt).toDate()
          : null,
      공동수급협정서접수방식: this.data.cmmnSpldmdMethdNm,
      공동수급협정마감일시:
        this.data.cmmnSpldmdAgrmntClseDt !== ''
          ? dayjs(this.data.cmmnSpldmdAgrmntClseDt).toDate()
          : null,
      공동수급업체지역제한여부: this.data.cmmnSpldmdCorpRgnLmtYn === 'Y',
      입찰개시일시:
        this.data.bidBeginDt !== ''
          ? dayjs(this.data.bidBeginDt).toDate()
          : null,
      입찰마감일시:
        this.data.bidClseDt !== '' ? dayjs(this.data.bidClseDt).toDate() : null,
      개찰일시:
        this.data.opengDt !== '' ? dayjs(this.data.opengDt).toDate() : null,
      공고규격서URL: [
        this.data.ntceSpecDocUrl1,
        this.data.ntceSpecDocUrl2,
        this.data.ntceSpecDocUrl3,
        this.data.ntceSpecDocUrl4,
        this.data.ntceSpecDocUrl5,
        this.data.ntceSpecDocUrl6,
        this.data.ntceSpecDocUrl7,
        this.data.ntceSpecDocUrl8,
        this.data.ntceSpecDocUrl9,
        this.data.ntceSpecDocUrl10,
      ].filter((i) => i !== ''),
      공고규격파일명: [
        this.data.ntceSpecFileNm1,
        this.data.ntceSpecFileNm2,
        this.data.ntceSpecFileNm3,
        this.data.ntceSpecFileNm4,
        this.data.ntceSpecFileNm5,
        this.data.ntceSpecFileNm6,
        this.data.ntceSpecFileNm7,
        this.data.ntceSpecFileNm8,
        this.data.ntceSpecFileNm9,
        this.data.ntceSpecFileNm10,
      ].filter((i) => i !== ''),
      재입찰허용여부: this.data.rbidPermsnYn === 'Y',
      물품분류제한여부: this.data.prdctClsfcLmtYn === 'Y',
      제조여부: this.data.mnfctYn === 'Y',
      예정가격결정방법명: this.data.prearngPrceDcsnMthdNm,
      총예가건수: parseInt(this.data.totPrdprcNum),
      추첨예가건수: parseInt(this.data.drwtPrdprcNum),
      배정예산금액: parseInt(this.data.asignBdgtAmt),
      추정가격: parseInt(this.data.presmptPrce),
      개찰장소: this.data.opengPlce,
      입찰공고상세URL: this.data.bidNtceDtlUrl,
      입찰공고URL: this.data.bidNtceUrl,
      입찰참가수수료납부여부: this.data.bidPrtcptFeePaymntYn,
      입찰참가수수료: parseInt(this.data.bidPrtcptFee),
      입찰보증금납부여부: this.data.bidGrntymnyPaymntYn === 'Y',
      채권자명: this.data.crdtrNm,
      물품순번: parseInt(this.data.prdctSno),
      세부품명번호: this.data.dtilPrdctClsfcNo,
      세부품명: this.data.dtilPrdctClsfcNoNm,
      물품규격명: this.data.prdctSpecNm,
      물품수량: this.data.prdctQty ? parseInt(this.data.prdctQty) : 0,
      물품단위: this.data.prdctUnit,
      물품단가: this.data.prdctUprc ? parseInt(this.data.prdctUprc) : 0,
      납품기한일시:
        this.data.dlvrTmlmtDt !== ''
          ? dayjs(this.data.dlvrTmlmtDt).toDate()
          : null,
      납품일수: parseInt(this.data.dlvrDaynum),
      인도조건명: this.data.dlvryCndtnNm,
      구매대상물품목록: this.data.purchsObjPrdctList.split(','),
      통합공고번호: this.data.untyNtceNo,
      공동수급방식코드: this.data.cmmnSpldmdMethdCd,
      공동수급구성방식명: this.data.cmmnSpldmdMethdNm,
      표준공고서URL: this.data.stdNtceDocUrl,
      지사투찰허용여부: this.data.brffcBidprcPermsnYn === 'Y',
      지명경쟁여부: this.data.dsgntCmptYn === 'Y',
      예비가격재작성방법명: this.data.prearngPrceDcsnMthdNm,
      실적신청서접수방법명: this.data.arsltApplDocRcptMthdNm,
      실적신청서접수일시:
        this.data.arsltApplDocRcptDt !== ''
          ? dayjs(this.data.arsltApplDocRcptDt).toDate()
          : null,
      발주계획통합번호: this.data.orderPlanUntyNo,
      낙찰하한율: parseFloat(this.data.sucsfbidLwltRate),
      등록일시:
        this.data.rgstDt !== '' ? dayjs(this.data.rgstDt).toDate() : null,
      사전규격등록번호: this.data.bfSpecRgstNo,
      낙찰방법코드: this.data.sucsfbidMthdCd,
      낙찰방법명: this.data.sucsfbidMthdNm,
      수요기관담당자이메일주소: this.data.dminsttOfclEmailAdrs,
      업종제한여부: this.data.indstrytyLmtYn === 'Y',
      변경공고사유: this.data.chgNtceRsn,
      재입찰개찰일시:
        this.data.rbidOpengDt !== ''
          ? dayjs(this.data.rbidOpengDt).toDate()
          : null,
    };
  }
}
