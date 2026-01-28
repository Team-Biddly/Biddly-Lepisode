/* eslint-disable @angular-eslint/no-input-rename */
import {
  Component,
  computed,
  HostBinding,
  inject,
  input,
  model,
} from '@angular/core';
import { BaseConfig } from '../../common/config/config.adapter';
import { Align } from '../../common/types';
import { DataGridStore } from '../data-grid.store';
import { ColumnDefinition } from '../types/colum-definition.type';
import { GridOptions } from '../types/grid.type';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-grid-table-adapter',
  template: '',
  standalone: true,
})
export class GridViewAdapter extends BaseConfig {
  @HostBinding('class') class = 'w-full overflow-hidden';

  readonly store = inject(DataGridStore);

  _options = input<GridOptions | null>(null, { alias: 'options' });
  _columns = input<ColumnDefinition[] | null>(null, { alias: 'columns' });
  _rowData = input<any[] | null>(null, { alias: 'rowData' });

  // 정렬, 그룹화 등 옵션 On/Off
  showHeaderOption = input<boolean>(true);

  $columns = this.store.columns;
  $rowData = this.store.rowData;
  $options = this.store.tableOptions;

  columns = computed(() => this._columns() || this.$columns());
  rowData = computed(() => this._rowData() || this.$rowData());
  options = computed(() => this._options() || this.$options());
  dragDrop = computed(() => (this.options() as any)?.dragDrop);

  align = model<Align>('desc');
  orderBy = model<string>('createdAt');

  selecteds = model<any[]>([]);

  /**
   * @name handleDragDrop
   * @description 드래그 앤 드롭 이벤트 핸들러
   * @param {CdkDragDrop<any>} event
   * @returns {void}
   */
  handleDragDrop(event: CdkDragDrop<any>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    // drag-handler-cell

    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    if (this.dragDrop()?.handler) {
      this.dragDrop().handler(event);
    }
  }
}
