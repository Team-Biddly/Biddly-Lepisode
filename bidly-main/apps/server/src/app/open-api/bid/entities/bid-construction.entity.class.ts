import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { OpenAPIEntity } from '../../openapi.entity.abstract.class';
import { Bid_Construction } from '../types/bid-construction.type';

export class BidConstructionEntity extends OpenAPIEntity {
  constructor(private data: Bid_Construction) {
    super();
  }

  toCreateInput(): Prisma.Bid_ConstructionCreateInput {
    return {
      id: this.data.bidNtceNo,
      입찰공고명: this.data.bidNtceNm,
      입찰공고차수: +this.data.bidNtceOrd,
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
      PQ신청서접수방법명: this.data.pqApplDocRcptMthdNm,
      PQ신청서접수일시: this.data.pqApplDocRcptDt
        ? dayjs(this.data.pqApplDocRcptDt).toDate()
        : null,
      실적신청서접수방법명: this.data.arsltApplDocRcptMthdNm,
      실적신청서접수일시: this.data.arsltApplDocRcptDt
        ? dayjs(this.data.arsltApplDocRcptDt).toDate()
        : null,
      공동도급의무지역명: [
        this.data.jntcontrctDutyRgnNm1,
        this.data.jntcontrctDutyRgnNm2,
        this.data.jntcontrctDutyRgnNm3,
      ].filter((i) => i !== ''),
      지역의무공동도급비율: +this.data.rgnDutyJntcontrctRt,
      내역입찰여부: this.data.dtlsBidYn === 'Y',
      입찰참가제한여부: this.data.bidPrtcptLmtYn === 'Y',
      예정가격결정방법명: this.data.prearngPrceDcsnMthdNm,
      총예가건수: +this.data.totPrdprcNum,
      추첨예가건수: +this.data.drwtPrdprcNum,
      예산금액: parseInt(this.data.bdgtAmt),
      추정가격: +this.data.presmptPrce,
      관급금액: +this.data.govsplyAmt,
      적용기준내용: this.data.aplBssCntnts,
      업종평가비율: parseFloat(this.data.indstrytyEvlRt),
      주공종명: this.data.mainCnsttyNm,
      주공종공사예정금액: parseInt(this.data.mainCnsttyPresmptPrce),
      가산지역명: [
        this.data.incntvRgnNm1,
        this.data.incntvRgnNm2,
        this.data.incntvRgnNm3,
        this.data.incntvRgnNm4,
      ].filter((i) => i !== ''),
      개찰장소: this.data.opengPlce,
      설명회실시일시:
        this.data.dcmtgOprtnDt !== ''
          ? dayjs(this.data.dcmtgOprtnDt).toDate()
          : null,
      설명회실시장소: this.data.dcmtgOprtnPlce,
      도급자설치관급자재금액: parseInt(this.data.contrctrcnstrtnGovsplyMtrlAmt),
      관급자설치관급자재금액: parseInt(this.data.govcnstrtnGovsplyMtrlAmt),
      입찰공고상세URL: this.data.bidNtceDtlUrl,
      입찰공고URL: this.data.bidNtceUrl,
      입찰참가수수료납부여부: this.data.bidPrtcptFeePaymntYn,
      입찰참가수수료: parseInt(this.data.bidPrtcptFee),
      입찰보증금납부여부: this.data.bidGrntymnyPaymntYn === 'Y',
      채권자명: this.data.crdtrNm,
      공동수급업체수: parseInt(this.data.cmmnSpldmdCnum),
      통합공고번호: this.data.untyNtceNo,
      현장설명서URL: [
        this.data.sptDscrptDocUrl1,
        this.data.sptDscrptDocUrl2,
        this.data.sptDscrptDocUrl3,
        this.data.sptDscrptDocUrl4,
        this.data.sptDscrptDocUrl5,
      ].filter((i) => i !== ''),
      부대공종명: [
        this.data.subsiCnsttyNm1,
        this.data.subsiCnsttyNm2,
        this.data.subsiCnsttyNm3,
        this.data.subsiCnsttyNm4,
        this.data.subsiCnsttyNm5,
        this.data.subsiCnsttyNm6,
        this.data.subsiCnsttyNm7,
        this.data.subsiCnsttyNm8,
        this.data.subsiCnsttyNm9,
      ].filter((i) => i !== ''),
      부공종업종평가비율: [
        this.data.subsiCnsttyIndstrytyEvlRt1,
        this.data.subsiCnsttyIndstrytyEvlRt2,
        this.data.subsiCnsttyIndstrytyEvlRt3,
        this.data.subsiCnsttyIndstrytyEvlRt4,
        this.data.subsiCnsttyIndstrytyEvlRt5,
        this.data.subsiCnsttyIndstrytyEvlRt6,
        this.data.subsiCnsttyIndstrytyEvlRt7,
        this.data.subsiCnsttyIndstrytyEvlRt8,
        this.data.subsiCnsttyIndstrytyEvlRt9,
      ]
        .filter((i) => i !== '')
        .map((i) => parseFloat(i)),
      공동수급방식코드: this.data.cmmnSpldmdMethdCd,
      공동수급방식명: this.data.cmmnSpldmdMethdNm,
      표준공고서URL: this.data.stdNtceDocUrl,
      지사투찰허용여부: this.data.brffcBidprcPermsnYn === 'Y',
      공종별지분율목록: this.data.cnsttyAccotShreRateList,
      시공능력평가금액목록: this.data.cnstrtnAbltyEvlAmtList,
      지명경쟁여부: this.data.dsgntCmptYn === 'Y',
      실적경쟁여부: this.data.arsltCmptYn === 'Y',
      PQ심사여부: this.data.pqEvalYn === 'Y',
      공고설명여부: this.data.ntceDscrptYn === 'Y',
      예비가격재작성방법명: this.data.prearngPrceDcsnMthdNm,
      주공종추정가격: parseInt(this.data.mainCnsttyPresmptPrce),
      발주계획통합번호: this.data.orderPlanUntyNo,
      낙찰하한율: parseFloat(this.data.sucsfbidLwltRate),
      등록일시:
        this.data.rgstDt !== '' ? dayjs(this.data.rgstDt).toDate() : null,
      사전규격등록번호: this.data.bfSpecRgstNo,
      낙찰방법코드: this.data.sucsfbidMthdCd,
      낙찰방법명: this.data.sucsfbidMthdNm,
      수요기관담당자이메일주소: this.data.dminsttOfclEmailAdrs,
      업종제한여부: this.data.indstrytyLmtYn === 'Y',
      공사현장지역명: this.data.cnstrtsiteRgnNm,
      지역의무공동도급여부: this.data.rgnDutyJntcontrctYn === 'Y',
      변경공고사유: this.data.chgNtceRsn,
      재입찰개찰일시:
        this.data.rbidOpengDt !== ''
          ? dayjs(this.data.rbidOpengDt).toDate()
          : null,
      건설산업법적용대상여부: this.data.ciblAplYn === 'Y',
      상호시장진출허용여부: this.data.mtltyAdvcPsblYn === 'Y',
      건설산업법적용대상공사명: this.data.mtltyAdvcPsblYnCnstwkNm,
      부가가치세: parseInt(this.data.VAT),
      주공종부가가치세: parseInt(this.data.indutyVAT),
      주력분야평가여부: this.data.indstrytyMfrcFldEvlYn === 'Y',
      입찰보증서접수마감일시:
        this.data.bidWgrnteeRcptClseDt !== ''
          ? dayjs(this.data.bidWgrnteeRcptClseDt).toDate()
          : null,
    };
  }
}
