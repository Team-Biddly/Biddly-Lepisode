/**
 * 공공데이터포털 목록 조회 공통 파라미터
 * @author 최강훈 <ganghun@lepisode.team>
 */
export type OpenAPIListCommonParams = {
  /**
   * 페이지 번호
   */
  pageNo: string | number;
  /**
   * 한 페이지 결과 수
   *
   * 최대 10 ~ 999 이며 서비스 마다 상이
   */
  numOfRows: string | number;
};
