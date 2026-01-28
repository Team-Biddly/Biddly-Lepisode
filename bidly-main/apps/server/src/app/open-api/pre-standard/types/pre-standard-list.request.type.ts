import { OpenAPIListCommonParams } from '../../types/openapi-list.request.type';

export type PreStandardListRequestParams =
  | PreStandardListRequestByDateParams
  | PreStandardListRequestBySpecRgstNoParams;

/**
 * 등록일시 / 변경일시 기준 조회
 */
type PreStandardListRequestByDateParams = OpenAPIListCommonParams & {
  /**
   * 조회 구분
   * 1: 등록일시 기준 조회
   * 3: 변경일시 기준 조회
   */
  inqryDiv: 1 | 3;
  /**
   * 조회 시작일 (YYYYMMDDHHMM)
   */
  inqryBgnDt: string[12];
  /**
   * 조회 시작일 (YYYYMMDDHHMM)
   */
  inqryEndDt: string[12];
};

/**
 * 사전규격등록번호 기준 조회
 */
type PreStandardListRequestBySpecRgstNoParams = OpenAPIListCommonParams & {
  /**
   * 조회 구분
   * 2: 사전규격등록번호 기준 조회
   */
  inqryDiv: 2;

  /**
   * 사전규격등록번호
   */
  bfSpecRgstNo: string;
};
