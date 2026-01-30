/**
 * 공공데이터포털 공통 응답
 * @author 최강훈 <ganghun@lepisode.team>
 */
export type OpenAPIResponse<T> = {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: T[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
};
