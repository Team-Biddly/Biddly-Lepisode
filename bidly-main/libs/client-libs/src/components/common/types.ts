export type Color =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'info'
  | 'error';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Rounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type Variant = 'solid' | 'outline' | 'ghost' | 'light';

export type Align = 'asc' | 'desc';

export type PageInfo = {
  pageItems?: number;
  pageNo?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
};
