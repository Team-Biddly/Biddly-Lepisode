import { computed, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BaseStore } from '../../stores/base.store';
import { ColumnDefinition } from './types/colum-definition.type';
import {
  GalleryViewGridOptions,
  GridOptions,
  TableViewGridOptions,
} from './types/grid.type';

type State = {
  rowData: any[] | undefined;
  columns: ColumnDefinition[];
  options: GridOptions | null;
  groupBy: string | null;
};

@Injectable({ providedIn: 'any' })
export class DataGridStore extends BaseStore<State> {
  rowData$ = this.state$.pipe(map((state) => state.rowData));
  columns$ = this.state$.pipe(map((state) => state.columns));
  options$ = this.state$.pipe(map((state) => state.options));
  groupBy$ = this.state$.pipe(map((state) => state.groupBy));

  groupBy = toSignal(this.groupBy$);
  rowData = toSignal(this.rowData$);
  columns = toSignal(this.columns$);
  options = toSignal(this.options$);
  tableOptions = computed<TableViewGridOptions>(
    () => this.options() as TableViewGridOptions,
  );
  galleryOptions = computed<GalleryViewGridOptions>(
    () => this.options() as GalleryViewGridOptions,
  );

  constructor() {
    super({
      rowData: [],
      columns: [],
      options: null,
      groupBy: null,
    });
  }

  init(state: Pick<State, 'rowData' | 'columns' | 'options'>): void {
    this.updateState({ ...state });
  }

  setGroupBy(groupBy: string | null): void {
    this.updateState({ groupBy });
  }
}
