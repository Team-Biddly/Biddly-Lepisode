/**
 * 카카오 토큰 요청 응답
 * @see https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token-response
 * @author 최강훈 <ganghun@lepisode.team>
 */
export type KakaoTokenResponse = {
  token_type: "bearer";
  access_token: string;
  id_token?: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
};

/**
 * 카카오 사용자 정보 응답
 * @see https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info-response
 * @author 최강훈 <ganghun@lepisode.team>
 */
export type KakaoAccountResponse = {
  /** 회원번호 */
  id: number;
  /** 사용자 프로퍼티 */
  properties?: Record<string, any>;
  /** 카카오 계정 정보 */
  kakao_account?: {
    /** 카카오계정 이름 */
    name?: string;
    /** 카카오계정 대표 이메일 */
    email?: string;
    /** 프로필 정보 */
    profile?: {
      /** 닉네임 */
      nickname?: string;
      /** 프로필 미리보기 이미지 URL */
      thumbnail_image_url?: string;
      /** 프로필 사진 URL */
      profile_image_url?: string;
      /** 기본 프로필 사진 URL 여부 */
      is_default_image?: boolean;
      /** 기본 닉네임 여부 */
      is_default_nickname?: string;
    };
    /** 연령대 */
    age_range:
      | "1~9"
      | "10~14"
      | "15~19"
      | "20~29"
      | "30~39"
      | "40~49"
      | "50~59"
      | "60~69"
      | "70~79"
      | "80~89"
      | "90~";
    /** 출생년도 (YYYY) */
    birthyear?: string;
    /** 생일 (MMDD) */
    birthday?: string;
    /** 생일 타입 */
    birthday_type?: "SOLAR" | "LUNAR";
    /** 성별 */
    gender?: "male" | "female";
    /** 전화번호 */
    phone_number?: string;
    /** 연계정보 */
    ci?: string;
    /** CI 발급 시각 */
    ci_authenticated_at?: Date;
    /** 이메일 유효 여부 */
    is_email_valid?: boolean;
    /** 이메일 인증 여부 */
    is_email_verified?: boolean;
    /** 프로필 정보 제공 동의 여부 */
    profile_needs_agreement?: boolean;
    /** 프로필 닉네임 제공 동의 여부 */
    profile_nickname_needs_agreement?: boolean;
    /** 프로필 사진 제공 동의 여부 */
    profile_image_needs_agreement?: boolean;
    /** 카카오계정 이름 제공 동의 여부 */
    name_needs_agreement?: boolean;
    /** 카카오계정 대표 이메일 제공 동의 여부 */
    email_needs_agreement?: boolean;
    /** 연령대 제공 동의 여부 */
    age_range_needs_agreement?: boolean;
    /** 출생년도 제공 동의 여부 */
    birthyear_needs_agreement?: boolean;
    /** 생일 제공 동의 여부 */
    birthday_needs_agreement?: boolean;
    /** 성별 제공 동의 여부 */
    gender_needs_agreement?: boolean;
    /** 전화번호 제공 동의 여부 */
    phone_number_needs_agreement?: boolean;
  };
  has_signed_up?: boolean;
  /** 서비스 연결 완료 시각 */
  connected_at?: Date;
  /** 카카오싱크 간편가입을 통해 로그인한 시각 */
  synched_at?: Date;
};
