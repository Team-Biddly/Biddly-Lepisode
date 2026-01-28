import { PipeTransform } from '@angular/core';
import { Color } from '../../common/types';
import { Calculation } from './group.type';

export type ColumnDefinition =
  | TextColumnDefinition
  | NumberColumnDefinition
  | DateColumnDefinition
  | CheckboxColumnDefinition
  | BooleanColumnDefinition
  | EnumColumnDefinition
  | CustomColumnDefinition
  | DragHandlerColumnDefinition;

type DefaultColumnDefinition = {
  name: string;
  field: string;
  cellClickHandler?: (data: any) => void;
  formatter?: (value: any, row?: any) => any;

  /**
   * field명을 대체할 alias명
   */
  alias?: string;
  pipe?: PipeTransform;
  style?: {
    cellClass?: string;
    columnClass?: string;
  };
  group?: {
    calculate?: Calculation;
    calculateFormatter?: (value: any) => any;
  };
  filter?: {
    disabled?: boolean;
  };
};

export type TextColumnDefinition = DefaultColumnDefinition & {
  type: 'text';
};

export type NumberColumnDefinition = DefaultColumnDefinition & {
  type: 'number';
};

export type DateColumnDefinition = DefaultColumnDefinition & {
  type: 'date';
  format?: string;
};

export type CheckboxColumnDefinition = DefaultColumnDefinition & {
  type: 'checkbox';
};

export type EnumColumnDefinition = DefaultColumnDefinition & {
  type: 'enum';
  badgeProps: {
    [key: string]: {
      color: Color;
      text: string;
    };
  };
};

export type BooleanColumnDefinition = DefaultColumnDefinition & {
  type: 'boolean';
  badgeProps: {
    true: {
      color: Color;
      text: string;
    };
    false?: {
      color: Color;
      text: string;
    };
  };
};

export type CustomColumnDefinition = DefaultColumnDefinition & {
  type: 'custom';
  renderItem: any;
};

export type DragHandlerColumnDefinition = DefaultColumnDefinition & {
  type: 'drag-handler';
  dragHandler?: (data: any) => void;
};
