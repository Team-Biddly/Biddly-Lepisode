export interface NCPSMSSendRequest {
  type: "SMS" | "LMS" | "MMS" | "sms" | "lms" | "mms";
  /**
   * 메시지 Type
   * @default 'COMM'
   */
  contentType?: "COMM" | "AD";
  /**
   * 국가 번호
   * @default '82'
   */
  countryCode?: string;
  /**
   * 발신번호
   * @description 사전 등록된 발신번호만 사용 가능
   */
  from: string;
  /**
   * 기본 메시지 제목
   * @description LMS, MMS에서만 사용 가능
   */
  subject?: string;
  /**
   * 기본 메시지 내용
   * @description SMS : 최대 90 byte, LMS, MMS : 최대 2000 byte
   */
  content: string;
  /**
   * 메시지 정보
   * @description 최대 100개
   */
  messages: Message[];
  /**
   *  파일
   * @description MMS에서만 사용 가능
   */
  files?: File[];
  /**
   * 예약 일시
   * @description yyyy-MM-dd HH:mm
   */
  reserveTime?: string;
  /**
   * 예약 일시 타임존
   * @default Asia/Seoul
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  reserveTimeZone?: string;
}

export interface File {
  fileId: string;
}

export interface Message {
  /**
   * 수신번호
   * @description 붙임표 (-)를 제외한 숫자만 입력 가능
   */
  to: string;
  /**
   * 개별 메시지 제목
   * @description LMS, MMS에서만 사용 가능
   */
  subject?: string;
  /**
   * 개별 메시지 내용
   * @description SMS : 최대 90 byte, LMS, MMS : 최대 2000 byte
   */
  content?: string;
}

export interface NCPSMSSendResponse {
  /**
   * 요청 아이디
   */
  requestId: string;
  /**
   * 요청 시간
   * @description yyyy-MM-dd HH:mm:ss.SSS
   */
  requestTime: string;
  /**
   * 요청 상태 코드
   * @description 202 : 성공 / 그외 : 실패
   */
  statusCode: string;
  /**
   * 요청 상태명
   */
  statusName: "success" | "fail";
}
