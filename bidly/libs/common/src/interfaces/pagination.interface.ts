export interface PaginationDto {
  items: any;
  pageInfo: {
    pageItems?: number;
    pageNo?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
  };
}
