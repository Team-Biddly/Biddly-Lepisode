export const PreStandardType = {
  일반용역: '일반용역',
  기술용역: '기술용역',
  물품: '물품',
  공사: '공사',
  외자: '외자',
} as const;

export type PreStandardType =
  (typeof PreStandardType)[keyof typeof PreStandardType];
