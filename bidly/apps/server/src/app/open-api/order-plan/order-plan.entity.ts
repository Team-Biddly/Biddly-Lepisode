import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { OpenAPIEntity } from '../openapi.entity.abstract.class';
import { OrderPlan_Construction } from './types/order-plan-construction.type';
import { OrderPlan_Foreign } from './types/order-plan-foreign.type';
import { OrderPlan_Service } from './types/order-plan-service.type';
import { OrderPlan_Thing } from './types/order-plan-thing.type';

export class OrderPlanEntity extends OpenAPIEntity {
  constructor(
    private readonly data:
      | OrderPlan_Service
      | OrderPlan_Construction
      | OrderPlan_Foreign
      | OrderPlan_Thing,
  ) {
    super();
  }

  /**
   * 안전한 정수 변환 (BigInt 타입용)
   */
  private safeParseBigInt(value: any): bigint | null {
    if (!value || value === '' || value === '0' || value === '0.0') return null;
    try {
      return BigInt(Math.floor(parseFloat(value.toString())));
    } catch {
      return null;
    }
  }

  /**
   * 안전한 정수 변환 (Int 타입용)
   */
  private safeParseInt(value: any): number | null {
    if (!value || value === '' || value === '0') return null;
    const parsed = parseInt(value.toString());
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * 안전한 실수 변환 (Float 타입용)
   */
  private safeParseFloat(value: any): number | null {
    if (!value || value === '' || value === '0' || value === '0.0') return null;
    const parsed = parseFloat(value.toString());
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * 안전한 날짜 변환
   */
  private safeParseDate(value: any): Date | null {
    if (!value || value === '') return null;
    try {
      const date = dayjs(value);
      return date.isValid() ? date.toDate() : null;
    } catch {
      return null;
    }
  }

  /**
   * 안전한 문자열 변환 (빈 문자열과 공백 처리)
   */
  private safeParseString(value: any): string | null {
    if (value === null || value === undefined) return null;

    // 숫자 타입인 경우
    if (typeof value === 'number') {
      return value.toString();
    }

    // 불린 타입인 경우
    if (typeof value === 'boolean') {
      return value.toString();
    }

    // 문자열인 경우
    const str = String(value).trim();
    return str === '' ? null : str;
  }

  toCreateInput(): Prisma.OrderPlanCreateInput {
    const specItems = {};

    // 규격항목 처리 - 빈 문자열이 아닌 경우만 추가
    if (this.data?.specItemNm1 && this.data?.specItemNm1.trim() !== '') {
      specItems[this.data.specItemNm1] = this.data?.specItemCntnts1 || '';
    }
    if (this.data?.specItemNm2 && this.data?.specItemNm2.trim() !== '') {
      specItems[this.data.specItemNm2] = this.data?.specItemCntnts2 || '';
    }
    if (this.data?.specItemNm3 && this.data?.specItemNm3.trim() !== '') {
      specItems[this.data.specItemNm3] = this.data?.specItemCntnts3 || '';
    }
    if (this.data?.specItemNm4 && this.data?.specItemNm4.trim() !== '') {
      specItems[this.data.specItemNm4] = this.data?.specItemCntnts4 || '';
    }
    if (this.data?.specItemNm5 && this.data?.specItemNm5.trim() !== '') {
      specItems[this.data.specItemNm5] = this.data?.specItemCntnts5 || '';
    }

    return {
      id: this.safeParseString(this.data?.orderPlanUntyNo) || '',
      업무구분코드: this.safeParseString(this.data?.bsnsDivCd),
      업무구분명: this.safeParseString(this.data?.bsnsDivNm),
      업무유형코드: this.safeParseString(this.data?.bsnsTyCd),
      업무유형명: this.safeParseString(this.data?.bsnsTyNm),
      발주년도: this.safeParseInt(this.data?.orderYear),
      발주기관코드: this.safeParseString(this.data?.orderInsttCd),
      총괄기관명: this.safeParseString(this.data?.totlmngInsttNm),
      소관구분코드: this.safeParseString(this.data?.jrsdctnDivCd),
      소관구분명: this.safeParseString(this.data?.jrsdctnDivNm),
      발주기관명: this.safeParseString(this.data?.orderInsttNm),
      발주계획순번: this.safeParseInt(this.data?.orderPlanSno),
      조달방식: this.safeParseString(this.data?.prcrmntMethd),
      발주월: this.safeParseString(this.data?.orderMnth),
      사업명: this.safeParseString(this.data?.bizNm),
      공사지역명: this.safeParseString(this.data?.cnstwkRgnNm),
      공종구분명: this.safeParseString(this.data?.cnsttyDivNm),
      계약방법명: this.safeParseString(this.data?.cntrctMthdNm),
      발주도급금액: this.safeParseBigInt(this.data?.orderContrctAmt),
      발주관급자재비: this.safeParseBigInt(this.data?.orderGovsplyMtrcst),
      발주기타금액: this.safeParseBigInt(this.data?.orderEtcAmt),
      합계발주금액: this.safeParseBigInt(this.data?.sumOrderAmt),
      부서명: this.safeParseString(this.data?.deptNm),
      담당자명: this.safeParseString(this.data?.ofclNm),
      전화번호: this.safeParseString(this.data?.telNo),
      협정여부: this.data?.agrmntYn === 'Y',
      공고게시여부: this.data?.ntceNticeYn === 'Y',
      합계발주미화금액: this.safeParseFloat(this.data?.sumOrderDolAmt),
      규격항목: Object.keys(specItems).length > 0 ? specItems : null,
      게시일시: this.safeParseDate(this.data?.nticeDt),
      발주금차도급금액: this.safeParseBigInt(this.data?.orderThtmContrctAmt),
      발주국고보조금액: this.safeParseBigInt(this.data?.orderNtntrsAuxAmt),
      발주계획통합번호: this.safeParseString(this.data?.orderPlanUntyNo),
    };
  }
}
