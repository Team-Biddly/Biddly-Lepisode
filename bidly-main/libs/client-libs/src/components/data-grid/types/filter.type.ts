export type SortData = {
  type: string;
  field: string;
  name: string;
  align: 'asc' | 'desc';
};

export type FilterData =
  | TextFilter
  | EnumFilter
  | NumberFilter
  | DateFilter
  | BooleanFilter
  | NoneFilter
  | RowNumberFilter
  | CustomFilter;

export type NoneFilter = {
  type: 'checkbox';
  field: string;
};

export type TextFilter = {
  type: 'text';
  field: string;
  name: string;
  query?: string;
};

export type EnumFilter = {
  type: 'enum';
  field: string;
  name: string;
  status?: any;
};

export type BooleanFilter = {
  type: 'boolean';
  field: string;
  name: string;
};

export type NumberFilter = {
  type: 'number';
  field: string;
  name: string;
  startNumber?: {
    moreThan?: number;
    lessThan?: number;
    equal?: number;
    moreThanOrEqual?: number;
    lessThanOrEqual?: number;
  };
  endNumber?: {
    moreThan?: number;
    lessThan?: number;
    equal?: number;
    moreThanOrEqual?: number;
    lessThanOrEqual?: number;
  };
};

export type DateFilter = {
  type: 'date';
  field: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
};

export type RowNumberFilter = {
  type: 'rowNumber';
  field: string;
  name: string;
  startNumber?: {
    moreThan?: number;
    lessThan?: number;
    equal?: number;
    moreThanOrEqual?: number;
    lessThanOrEqual?: number;
  };
  endNumber?: {
    moreThan?: number;
    lessThan?: number;
    equal?: number;
    moreThanOrEqual?: number;
    lessThanOrEqual?: number;
  };
};

export type CustomFilter = {
  type: 'custom';
  field: string;
  name: string;
  query?: string;
};
