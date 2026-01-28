/**
 * 사용자 탈퇴 상태
 */
export const UserAccountStatus = {
  /**
   * 정상
   */
  ACTIVE: 'ACTIVE',
  /**
   * 탈퇴를 요청했으나, 재가입이 가능한 상태
   */
  REJOINABLE: 'REJOINABLE',
  /**
   * 탈퇴됨
   */
  WITHDRAWN: 'WITHDRAWN',
  /**
   * 차단됨
   */
  BLOCKED: 'BLOCKED',
} as const;
