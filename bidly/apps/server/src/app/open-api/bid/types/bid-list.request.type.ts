import { OpenAPIListCommonParams } from '../../types/openapi-list.request.type';

export type BidListRequestParams =
  | BidListRequestByDateParams
  | BidListRequestByBidNtceNoParams;

/**
 * 등록일시 / 변경일시 기준 조회
 */
export type BidListRequestByDateParams = OpenAPIListCommonParams & {
  /**
   * 조회 구분
   * 1: 등록일시 기준 조회
   * 3: 변경일시 기준 조회
   */
  inqryDiv: 1 | 3;
  /**
   * 조회 시작일 (YYYYMMDDHHMM)
   */
  inqryBgnDt: string;
  /**
   * 조회 시작일 (YYYYMMDDHHMM)
   */
  inqryEndDt: string;
};

/**
 * 입찰공고번호 기준 조회
 */
export type BidListRequestByBidNtceNoParams = OpenAPIListCommonParams & {
  /**
   * 조회 구분
   * 2: 입찰공고번호 기준 조회
   */
  inqryDiv: 2;

  /**
   * 입찰공고번호
   */
  bidNtceNo: string;
};
