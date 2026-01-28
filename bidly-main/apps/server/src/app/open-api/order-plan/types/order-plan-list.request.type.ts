import { OpenAPIListCommonParams } from '../../types/openapi-list.request.type';

/**
 * 입찰공고목록 정보에 대한 공사/용역/외자/물품 조회 요청 매개변수
 */
export type OrderPlanListRequestParams =
  | OrderPlanListInqryDiv1RequestParams
  | OrderPlanListInqryDiv2RequestParams;

export type OrderPlanListInqryDiv1RequestParams = OpenAPIListCommonParams & {
  inqryDiv: 1;

  /**
   * 발주시작년월 (YYYYMM)
   * 조회구분 (inqryDiv) 값이 1일 때 필수
   * @example '202301'
   */
  orderBgnYm: string;

  /**
   * 발주종료년월 (YYYYMM)
   * 조회구분 (inqryDiv) 값이 1일 때 필수
   * @example '202312'
   */
  orderEndYm: string;

  /**
   * 조회시작일시 (YYYYMMDDHHmm)
   * 조회구분 (inqryDiv) 값이 1일 때 필수
   * @example '202301010000'
   */
  inqryBgnDt?: string;

  /**
   * 발주기관코드
   * 조회구분 (inqryDiv) 값이 1일 때 선택
   * @example '1100000'
   */
  orderInsttCd?: string;

  /**
   * 발주기관명
   * 조회구분 (inqryDiv) 값이 1일 때 선택
   * @example '서울특별시'
   */
  orderInsttNm?: string;

  /**
   * 조회종료일시 (YYYYMMDDHHmm)
   * 조회구분 (inqryDiv) 값이 1일 때 필수
   * @example '202312312359'
   */
  inqryEndDt?: string;
};

export type OrderPlanListInqryDiv2RequestParams = OpenAPIListCommonParams & {
  inqryDiv: 2;

  /**
   * 발주계획 통합번호
   * 조회구분 (inqryDiv) 값이 2일 때 필수
   * @example '1-1-2016-7000126-000009'
   */
  orderPlanUntyNo: string;
};
