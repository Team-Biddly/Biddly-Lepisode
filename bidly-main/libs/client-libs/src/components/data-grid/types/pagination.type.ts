import { Align } from '../../common/types';

export type DataGridSearchOptions = {
  pageNo: number;
  pageSize: number;
  query: string;
  align: Align;
  orderBy: string;
};
