export type OffsetSearchOption = {
  pageNo: number;
  pageSize: number;
  orderBy?: string;
  align?: "asc" | "desc";
  query?: string;
};
