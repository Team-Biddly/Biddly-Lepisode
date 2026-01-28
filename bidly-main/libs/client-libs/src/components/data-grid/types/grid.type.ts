import { BadgeVariant } from '../../badge/badge.component';
import { Variant } from '../../common/types';
import { ColumnDefinition } from './colum-definition.type';
import { GridGroupOptions } from './group.type';

export type GridOptions = TableViewGridOptions | GalleryViewGridOptions;

type GridRowOption = {
  options?: RowOptions[] | ((row: any) => RowOptions[]);
  clickHandler?: (data: any) => void;

  /**
   * row의 활성화 여부를 결정합니다.
   * @param row
   * @returns
   */
  active?: (row: any) => boolean;
};

/**
 * 검색과 관련된 옵션입니다.
 */
type GridSearchOption = {
  pageSize?: '5' | '10' | '20' | '50' | '100' | string | number;
  debounce?: number;

  /**
   * 페이지네이션을 사용할지 여부입니다.
   */
  disablePagination?: boolean;
};

/**
 * 그룹과 관련된 옵션입니다. (미구현)
 */
type GridGroupOption = {
  enable?: boolean;
  groupBy?: string;
  useCustomGroup?: boolean;
  columnFilter?: string[];
  options?: GridGroupOptions[];
};

/**
 * 테이블 헤더와 관련된 옵션입니다.
 */
type GridHeaderOption = {
  show?: boolean;
};

export type GalleryViewGridOptions = {
  view: 'gallery';
  field: {
    title: string;
    image: string;
    content: string;
  };
  row?: GridRowOption;
  dragDrop?: {
    enable?: boolean;
    handler?: (event: any) => void;
  };
  searchOption?: GridSearchOption;
  header?: GridHeaderOption;

  /**
   * 쿼리 파라미터를 사용할지 여부입니다.
   * @default false
   * true일 경우 자동으로 queryparams를 사용합니다.
   */
  handleQueryParams?: boolean;
};

export type TableViewGridOptions = {
  view: 'table';
  group?: GridGroupOption;
  row?: GridRowOption;
  column?: {
    sticky?: boolean;
  };
  dragDrop?: {
    enable?: boolean;
    handler?: (event: any) => void;
  };
  searchOption?: GridSearchOption;
  header?: GridHeaderOption;

  /**
   * checkbox를 사용할지 여부입니다.
   */
  checkbox?: boolean;

  /**
   * rowNumber를 사용할지 여부입니다.
   */
  rowNumber?: boolean;

  /**
   * badge 스타일을 지정합니다
   */
  badge?: {
    variant?: BadgeVariant;
  };

  /**
   * 쿼리 파라미터를 사용할지 여부입니다.
   * @default false
   * true일 경우 자동으로 queryparams를 사용합니다.
   */
  handleQueryParams?: boolean;
};

export type RowOptions = {
  label: string | ((row: any) => void);
  icon?: string;
  handler?: (row: any) => void;
};

export type CustomCellParams = { column: ColumnDefinition; row: any };
