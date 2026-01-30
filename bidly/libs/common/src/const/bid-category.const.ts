export const BidCategory = {
  ALL: '전체',
  CONSTRUCTION: '공사',
  GOODS: '물품',
  SERVICE: '일반용역',
};

export type BidCategory = keyof typeof BidCategory;
