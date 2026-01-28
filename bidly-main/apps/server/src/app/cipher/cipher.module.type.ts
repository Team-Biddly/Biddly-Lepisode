export type CipherModuleConfig = {
  /**
   * 암호화 대칭키
   * @default 32바이트 랜덤 문자열
   */
  key: string;

  /**
   * 암호화 알고리즘
   * @default aes-256-ctr
   */
  algorithm?: string;

  /**
   * 초기화 벡터
   * @default 16바이트 랜덤 문자열
   */
  iv: string;
};
