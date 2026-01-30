/**
 * NHN Cloud SMS 발송 Request Type
 * @author 최강훈 <ganghun@lepisode.team>
 * @see https://docs.nhncloud.com/ko/Notification/SMS/ko/api-guide/#sms_1
 */
export type NHNCloudSMSRequest = {
  /**
   * 발송 템플릿 아이디
   */
  templateId?: string;

  /**
   * 본문 내용
   * @description 표준 90 byte, 최대 255자 (EUC-KR 기준)
   */
  body: string;

  /**
   * 발신 번호
   * @description 최대 길이 13자리, NHN 클라우드에 등록된 번호만 사용 가능
   */
  // sendNo: string;

  /**
   * 예약 발송 시간
   * @description yyyy-MM-dd HH:mm
   */
  requestDate?: `${number}-${number}-${number} ${number}:${number}`;

  /**
   * 발신자 그룹 키
   */
  senderGroupingKey?: string;

  /**
   * 수신자 목록
   */
  recipientList: {
    /**
     * 수신자 번호
     */
    recipientNo: string;

    /**
     * 국가 번호
     */
    countryCode?: string;

    /**
     * 국가 번호가 포함된 수신 번호
     */
    internationalRecipientNo?: string;

    /**
     * 템플릿 파라미터(템플릿 ID 입력 시)
     */
    templateParameter?: Record<string, string>;

    /**
     * 수신자 그룹 키
     */
    recipientGroupingKey?: string;
  }[];

  /**
   * 발송 구분자 ex) admin, system
   */
  userId?: string;

  /**
   * 통계 ID
   */
  statsId?: string;

  /**
   * 식별 코드(특수 유형 부가 통신 사업자용)
   */
  originCode?: string;
};

/**
 * NHN Cloud SMS 발송 Request의 ResponseBody Type
 * @author 최강훈 <ganghun@lepisode.team>
 * @see https://docs.nhncloud.com/ko/Notification/SMS/ko/api-guide/#sms_1
 */
export type NHNCloudSMSRequestResponse = {
  /**
   * 요청 ID
   */
  requestId: string;

  /**
   * 요청 상태 코드( "1": 요청 중, "2": 요청 완료, "3": 요청 실패)
   */
  statusCode: string;

  /**
   * 발신자 그룹 키
   */
  senderGroupingKey: string;

  /**
   * 수신 목록
   */
  sendResultList: {
    /**
     * 수신 번호
     */
    recipientNo: string;

    /**
     * 결과 코드
     */
    resultCode: number;

    /**
     * 결과 메시지
     */
    resultMessage: string;

    /**
     * 수신자 시퀀스
     */
    recipientSeq: number;

    /**
     * 수신자 그룹 키
     */
    recipientGroupingKey: string;
  }[];
};

/**
 * 단문 SMS 발송 목록 조회 ResponseBody Type
 * @see https://docs.nhncloud.com/ko/Notification/SMS/ko/api-guide/#sms_4
 */
export type NHNCloudSMSResultDetail = {
  /**
   * 요청 ID
   */
  requestId: string;

  /**
   * 발신 일시
   * @description yyyy-MM-dd HH:mm:ss
   */
  requestDate: string;

  /**
   * 수신 일시
   * @description yyyy-MM-dd HH:mm:ss
   */
  resultDate: string;

  /**
   * 템플릿 ID
   */
  templateId: string;

  /**
   * 템플릿명
   */
  templateName: string;

  /**
   * 카테고리 ID
   */
  categoryId: number;

  /**
   * 카테고리명
   */
  categoryName: string;

  /**
   * 본문 내용
   */
  body: string;

  /**
   * 발신 번호
   */
  sendNo: string;

  /**
   * 국가 번호
   */
  countryCode: string;

  /**
   * 수신 번호
   */
  recipientNo: string;

  /**
   * 메시지 상태 코드
   */
  msgStatus: string;

  /**
   * 메시지 상태 코드명
   */
  msgStatusName: string;

  /**
   * 수신 결과 코드
   * @see https://docs.nhncloud.com/ko/Notification/SMS/ko/error-code/#emma-v3
   */
  resultCode: string;

  /**
   * 수신 결과 코드명
   */
  resultCodeName: string;

  /**
   * 통신사 코드
   */
  telecomCode: number;

  /**
   * 통신사명
   */
  telecomCodeName: string;

  /**
   * 발송 상세 ID(상세 검색 시 필수)
   */
  recipientSeq: number;

  /**
   * 발송 유형("0": SMS, "1": LMS, "2": MMS)
   */
  sendType: string;

  /**
   * 메시지 타입(SMS/LMS/MMS/AUTH)
   */
  messageType: string;

  /**
   * 발송된 메시지 건수
   */
  messageCount: number;

  /**
   * 발송 요청 ID
   */
  userId: string;

  /**
   * 광고 여부
   */
  adYn: "Y" | "N";

  /**
   * 결과 메시지
   */
  originCode: string;

  /**
   * 결과 메시지
   */
  resultMessage: string;

  /**
   * 발신자 그룹 키
   */
  senderGroupingKey: string;

  /**
   * 수신자 그룹 키
   */
  recipientGroupingKey: string;
};
