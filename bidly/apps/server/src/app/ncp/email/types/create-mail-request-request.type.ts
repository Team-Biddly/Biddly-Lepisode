/**
 * @see https://api.ncloud-docs.com/docs/ai-application-service-cloudoutboundmailer-createmailrequest#%EC%9A%94%EC%B2%AD
 * @author 최강훈 <ganghun@lepisode.team>
 */

export type NCPSendMailRequest =
  | NCPSendMailWithoutTemplateRequest
  | NCPSendMailWithTemplateRequest;

type CreateMailRequestCommon = {
  recipients: RecipientforRequest[];
  /**
   *  개인별 발송 혹은 일반 발송 여부
   *  @default true
   */
  individual?: boolean;
  /** 확인 후 발송 여부 */
  confirmAndSend?: boolean;
  /** 광고메일여부 */
  advertising?: boolean;
  /** 치환 파라미터 */
  parameters?: object;
  /** 특정 메일을 모아서 보기 위해 네이버 메일에서 지원하는 기능 (해당 필드에 동일한 값을 입력한 메일들을 모아서 볼 수 있음)  */
  referencesHeader?: string;
  /**
   * 예약 발송 일시
   * reservationDateTime 값보다 이 값이 우선 적용됨
   */
  reservationUtc?: number;
  /**
   * 예약 발송 일시
   *
   * 'yyyy-MM-dd HH:mm' UTC+09:00
   * reservationUtc 값 우선
   */
  reservationDateTime?: string;
  /** 첨부파일 ID 목록 */
  attachFileIds?: string[];
  useBasicUnscribeMsg?: boolean;
  unsubscribeMessage?: string;
};

type NCPSendMailWithoutTemplateRequest = CreateMailRequestCommon & {
  /** 발송자 Email 주소
   *
   */
  // senderAddress?: string;
  /** 발송자 이름 */
  senderName?: string;
  /** Mail 제목 */
  title: string;
  /** Email 본문 */
  body: string;
};

type NCPSendMailWithTemplateRequest = CreateMailRequestCommon & {
  /** 템플릿 ID */
  templateSid: number;
};

type RecipientforRequest = {
  address: string;
  name?: string;
  /**
   * 수신자 타입
   *
   * R: 수신자
   * C: 참조
   * B: 숨은 참조
   */
  type: "R" | "C" | "B";
  parameters?: object;
};
