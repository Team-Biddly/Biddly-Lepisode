export const Events = {
  /**
   * 사용자가 생성됨
   */
  USER_CREATED: 'USER_CREATED',

  /**
   * 사용자가 탈퇴를 요청함
   */
  USER_WITHDRAW_REQUESTED: 'USER_WITHDRAW_REQUESTED',

  /**
   * 사용자가 탈퇴됨
   */
  USER_WITHDRAWN: 'USER_WITHDRAWN',

  /**
   * 사용자가 탈퇴를 취소함
   */
  USER_WITHDRAW_CANCELED: 'USER_WITHDRAW_CANCELED',

  /**
   * 사용자가 차단됨
   */
  USER_BLOCKED: 'USER_BLOCKED',

  /**
   * 사용자가 차단 해제됨
   */
  USER_UNBLOCKED: 'USER_UNBLOCKED',

  /**
   * 사용자가 삭제됨
   */
  USER_DELETED: 'USER_DELETED',

  /**
   * 사용자가 다중 삭제됨
   */
  USER_DELETED_MANY: 'USER_DELETED_MANY',

  /**
   * 개인정보 삭제 배치 작업이 완료됨
   */
  USER_DELETED_BATCH: 'USER_DELETED_BATCH',

  /**
   * 사용자가 로그인됨
   */
  USER_LOGGED_IN: 'USER_LOGGED_IN',

  /**
   * 사용자가 로그아웃됨
   */
  USER_LOGGED_OUT: 'USER_LOGGED_OUT',

  /**
   * 사용자 차단 해제 배치 작업이 완료됨
   */
  USER_UNBLOCKED_BATCH: 'USER_UNBLOCKED_BATCH',

  /**
   * 관리자가 로그인됨
   */
  ADMIN_LOGGED_IN: 'ADMIN_LOGGED_IN',

  /**
   *  관리자가 차단됨
   */
  ADMIN_BLOCKED: 'ADMIN_BLOCKED',

  /**
   * 관리자가 차단 해제됨
   */
  ADMIN_UNBLOCKED: 'ADMIN_UNBLOCKED',

  /**
   * 워크스페이스에 사용자를 초대함
   */
  WORKSPACE_INVITE_REQUESTED: 'WORKSPACE_INVITE_REQUESTED',

  /**
   * 사용자가 초대를 수락함
   */
  WORKSPACE_INVITE_ACCEPTED: 'WORKSPACE_INVITE_ACCEPTED',

  /**
   * 사용자가 초대를 거절함
   */
  WORKSPACE_INVITE_REJECTED: 'WORKSPACE_INVITE_REJECTED',

  /**
   * 워크스페이스에 사용자가 가입을 요청함
   */
  WORKSPACE_JOIN_REQUESTED: 'WORKSPACE_JOIN_REQUESTED',

  /**
   * 워크스페이스에 사용자가 가입함
   */
  WORKSPACE_JOIN_ACCEPTED: 'WORKSPACE_JOIN_ACCEPTED',

  /**
   * 워크스페이스의 관리자가 가입을 거절함
   */
  WORKSPACE_JOIN_REJECTED: 'WORKSPACE_JOIN_REJECTED',

  /**
   * 사용자가 가입 요청을 취소함
   */
  WORKSPACE_JOIN_CANCELED: 'WORKSPACE_JOIN_CANCELED',

  /**
   * 워크스페이스가 삭제됨
   */
  WORKSPACE_DELETED: 'WORKSPACE_DELETED',
} as const;

/**
 * 이벤트 로그
 * @description 사용자의 활동을 기록하기 위한 이벤트 기반 로그입니다.
 */
export const UserEventLogs: {
  [key in keyof typeof Events]?: string;
} = {
  /**
   * 사용자 인증 관련
   */
  USER_CREATED: '회원 가입',
  USER_LOGGED_IN: '사용자 로그인',
  USER_LOGGED_OUT: '사용자 로그아웃',

  /**
   * 사용자 탈퇴 관련
   */
  USER_WITHDRAW_REQUESTED: '회원 탈퇴 요청',
  USER_WITHDRAW_CANCELED: '회원 탈퇴 취소',

  /**
   * 사용자 차단 관련
   */
  USER_BLOCKED: '사용자 차단',
  USER_UNBLOCKED: '사용자 차단 해제',

  /**
   * @todo 사용자 권한 변경 관련
   */

  /**
   * @todo 사용자 승인 관련
   */
};
