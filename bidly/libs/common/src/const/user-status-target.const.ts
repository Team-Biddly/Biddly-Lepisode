export const UserStatusTarget = {
  ALL: '전체',
  ACTIVE: '정상',
  BLOCKED: '차단',
  WITHDRAWN: '탈퇴',
};

export type UserStatusTarget = keyof typeof UserStatusTarget;
