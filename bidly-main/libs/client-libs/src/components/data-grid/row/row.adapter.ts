import {
  Component,
  computed,
  HostListener,
  inject,
  input,
  model,
} from '@angular/core';
import { DataGridStore } from '../data-grid.store';
import { ColumnDefinition } from '../types/colum-definition.type';
import { RowOptions } from '../types/grid.type';
import { BaseConfig } from '../../common/config/config.adapter';

@Component({
  selector: 'app-row-adapter',
  template: '',
  standalone: true,
})
export class RowAdapter extends BaseConfig {
  @HostListener('click') onClick() {
    if (this.options()?.row?.clickHandler) {
      this.options()?.row?.clickHandler!(this.row());
    }
  }

  readonly store = inject(DataGridStore);
  columns = input.required<ColumnDefinition[]>();
  row = input.required<any>();
  selecteds = model<any[]>([]);
  selectedIds = computed(() =>
    this.selecteds()?.map((item) => item['uniqueId']),
  );

  rowData = this.store.rowData;
  options = this.store.options;

  rowOptions = computed(() => {
    if (this.options()) {
      const options = this.options()!.row?.options;
      if (typeof options === 'function') {
        return options(this.row());
      }

      return options;
    }

    return [];
  });

  handleOption(option: RowOptions) {
    if (option.handler) {
      const selecteds = this.selectedIds();

      if (selecteds?.length || 0 > 0) {
        const rows: any[] = [];

        selecteds?.map((uniqueId) => {
          const row = this.rowData()?.find(
            (item: any) => item.uniqueId === uniqueId,
          );

          if (row) {
            rows.push(row);
          }
        });

        option.handler(rows);
        return;
      }

      option.handler(this.row());
    }
  }
}
