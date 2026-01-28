import { PeriodString } from '../../libs/util/date.util';

export type SettingType = {
  /**
   * 사용자 계정의 재가입 가능 기간
   */
  'PRIVACY:USER_WITHDRAWN_PERIOD': PeriodString;

  /**
   * 사용자 데이터 보관 기간
   */
  'PRIVACY:USER_DATA_PERIOD': PeriodString;

  /**
   * 사용자 계정의 차단 기간
   */
  'PRIVACY:USER_BLOCKED_PERIOD': PeriodString;

  /**
   * 회사명
   */
  'COMPANY:NAME': string;

  /**
   * 회사 주소
   */
  'COMPANY:ADDRESS': string;

  /**
   * 회사 전화번호
   */
  'COMPANY:TEL': string;

  /**
   * 회사 이메일
   */
  'COMPANY:EMAIL': string;

  /**
   * 회사 사업자 등록번호
   */
  'COMPANY:REGISTRATION_NUMBER': string;

  /**
   * 회사 대표자명
   */
  'COMPANY:CEO': string;

  /**
   * 회사 로고 이미지 URL
   */
  'COMPANY:LOGO': string;
};

/**
 * 관리자에서 제어해야하는 기본 설정값을 정의합니다.
 */
export const DefaultSettings: SettingType = {
  /**
   * 사용자 계정의 재가입 가능 기간
   * @default 7d
   */
  'PRIVACY:USER_WITHDRAWN_PERIOD': '7d',

  /**
   * 사용자 데이터 보관 기간
   * @default 1y
   */
  'PRIVACY:USER_DATA_PERIOD': '1y',

  /**
   * 사용자 계정의 차단 기간
   * @default 14d
   */
  'PRIVACY:USER_BLOCKED_PERIOD': '14d',

  /**
   * 회사명
   * @default "회사명"
   */
  'COMPANY:NAME': '회사명',

  /**
   * 회사 주소
   * @default "주소"
   */
  'COMPANY:ADDRESS': '주소',

  /**
   * 회사 전화번호
   * @default "전화번호"
   */
  'COMPANY:TEL': '전화번호',

  /**
   * 회사 이메일
   * @default "이메일"
   */
  'COMPANY:EMAIL': '이메일',

  /**
   * 회사 사업자 등록번호
   * @default "사업자 등록번호"
   */
  'COMPANY:REGISTRATION_NUMBER': '사업자 등록번호',

  /**
   * 회사 대표자명
   * @default "대표자명"
   */
  'COMPANY:CEO': '대표자명',

  /**
   * 회사 로고 이미지 URL
   * @default "https://picsum.photos/200/200"
   */
  'COMPANY:LOGO': 'https://picsum.photos/200/200',
};

export type OptionalSettings = Partial<SettingType>;
export type SettingKeys = keyof SettingType;

export type PrivacySettingKeys = Extract<
  keyof SettingType,
  `PRIVACY:${string}`
>;

export type CompanySettingKeys = Extract<
  keyof SettingType,
  `COMPANY:${string}`
>;

export type PrivacySetting = Pick<SettingType, PrivacySettingKeys>;
export type CompanySetting = Pick<SettingType, CompanySettingKeys>;
