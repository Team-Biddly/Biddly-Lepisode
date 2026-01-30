export const BidType = {
  공사: 'construction',
  물품: 'thing',
  용역: 'service',
  외자: 'foreign',
  기타: 'etc',
} as const;

export type BidType = (typeof BidType)[keyof typeof BidType];
