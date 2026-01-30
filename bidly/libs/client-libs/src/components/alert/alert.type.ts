export type AlertOptions = {
  /** 모달 유형 */
  type: 'success' | 'warning' | 'error' | 'info';
  /** 모달 제목 */
  title: string;
  /** 모달 아이콘 설정 */
  icon?: {
    /** 표시할 아이콘 이름 */
    name?: string;
  };
  /** 모달 내용 */
  content: string;
  /** 모달 내용 Markdown 적용 여부 */
  markdown?: boolean;
  /** 모달 표시 데이터 */
  data?: AlertContentData[];
  /** 버튼 설정 */
  buttons?: {
    /** 확인 버튼 설정 */
    confirm?: { text?: string; hidden?: boolean };
    /** 취소 버튼 설정 */
    cancel?: { text?: string; hidden?: boolean };
  };
  /** Form 설정 */
  inputs?: AlertInput[];
  checkbox?: {
    text: string;
  };
};

export type AlertContentData = {
  /** 데이터 Key */
  key: string;
  /** 데이터 Value */
  value: string;
};

export type AlertInput = {
  /**
   * Input Key
   * 'confirm' 이벤트와 반환되는 'data'에서 Key로 사용됩니다.
   */
  key: string;
  /** Input 유형 */
  type: 'text' | 'number' | 'password' | 'email' | 'tel' | 'textarea';
  /** Input 라벨 */
  label: string;
  /** Input Placeholder */
  placeholder?: string;
  /** Input 초기값 */
  defaultValue?: any;
  /** Input 필수 여부 */
  required?: boolean;
};

export type AlertResult = AlertConfirmResult | AlertCancelResult;

export type AlertConfirmResult = {
  action: 'confirm';
  /** Inputs 옵션으로 생성된 Form의 Value */
  data?: { [key: string]: any };
};

export type AlertCancelResult = {
  action: 'cancel';
};
