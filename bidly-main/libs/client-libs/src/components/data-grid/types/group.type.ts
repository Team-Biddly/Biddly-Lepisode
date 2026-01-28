export type Calculation =
  | 'sum'
  | 'average'
  | 'min'
  | 'max'
  | 'count'
  | 'emptyCount'
  | 'noEmptyCount';

export type GridGroupOptions = {
  name: string;
  handler: (data: any[], checkData: any[]) => void;
};
