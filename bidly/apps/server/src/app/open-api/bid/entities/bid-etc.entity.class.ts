import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { Bid_Etc } from '../types/bid-etc.type';
import { OpenAPIEntity } from '../../openapi.entity.abstract.class';

export class BidEtcEntity extends OpenAPIEntity {
  constructor(private data: Bid_Etc) {
    super();
  }

  toCreateInput(): Prisma.Bid_EtcCreateInput {
    return {
      id: this.data.bidNtceNo,
      입찰공고번호: this.data.bidNtceNo,
      입찰공고차수: parseInt(this.data.bidNtceOrd) || null,
      통합공고번호: this.data.untyNtceNo,
      등록유형명: this.data.rgstTyNm,
      공고종류명: this.data.ntceKindNm,
      입찰공고일시:
        this.data.bidNtceDt !== '' ? dayjs(this.data.bidNtceDt).toDate() : null,
      참조번호: this.data.refNo,
      입찰공고명: this.data.bidNtceNm,
      등록일시:
        this.data.rgstDt !== '' ? dayjs(this.data.rgstDt).toDate() : null,
      공고기관코드: this.data.ntceInsttCd,
      공고기관명: this.data.ntceInsttNm,
      수요기관명: this.data.dminsttNm,
      입찰방식명: this.data.bidMethdNm,
      계약체결방법명: this.data.cntrctCnclsMthdNm,
      낙찰방법명: this.data.sucsfbidMthdNm,
      재입찰허용여부: this.data.rbidPermsnYn === 'Y',
      공동수급여부: this.data.cmmnSpldmdYn === 'Y',
      입찰개시일시:
        this.data.bidBeginDt !== ''
          ? dayjs(this.data.bidBeginDt).toDate()
          : null,
      입찰마감일시:
        this.data.bidClseDt !== '' ? dayjs(this.data.bidClseDt).toDate() : null,
      개찰일시:
        this.data.opengDt !== '' ? dayjs(this.data.opengDt).toDate() : null,
      개찰장소: this.data.opengPlce,
      추정가격: this.data.presmptPrce ? parseInt(this.data.presmptPrce) : null,
      입찰참가수수료: this.data.bidPrtcptFee
        ? parseInt(this.data.bidPrtcptFee)
        : null,
      입찰참가수수료납부여부: this.data.bidPrtcptFeePaymntYn,
      입찰보증금납부대상여부: this.data.bidGrntymnyPaymntObjYn === 'Y',
      공고규격서URL: [
        this.data.ntceSpecDocUrl1,
        this.data.ntceSpecDocUrl2,
        this.data.ntceSpecDocUrl3,
        this.data.ntceSpecDocUrl4,
        this.data.ntceSpecDocUrl5,
      ].filter((i) => i !== ''),
      공고규격파일명: [
        this.data.ntceSpecFileNm1,
        this.data.ntceSpecFileNm2,
        this.data.ntceSpecFileNm3,
        this.data.ntceSpecFileNm4,
        this.data.ntceSpecFileNm5,
      ].filter((i) => i !== ''),
      입찰참가자격내용: this.data.bidQlfctRgstCntnts,
      비고내용: this.data.rmrkCntnts,
      입찰공고상세URL: this.data.bidNtceDtlUrl,
      입찰공고URL: this.data.bidNtceUrl,
    };
  }
}
