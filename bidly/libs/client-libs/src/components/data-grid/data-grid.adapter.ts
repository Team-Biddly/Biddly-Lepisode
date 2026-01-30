import { Component, inject, input, model, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BaseConfig } from '../common/config/config.adapter';
import { PageInfo } from '../common/types';
import { DataGridStore } from './data-grid.store';
import { ColumnDefinition } from './types/colum-definition.type';
import { GridOptions } from './types/grid.type';

@Component({
  template: ``,
  standalone: true,
})
export abstract class DataGridAdapter extends BaseConfig implements OnInit {
  rowData = input<any[] | undefined>([]);
  rowData$ = toObservable(this.rowData);
  columns = input<ColumnDefinition[]>([]);
  options = input<GridOptions>();
  selecteds = model<any[]>([]);

  pageInfo = model<PageInfo | undefined>(undefined);

  readonly store = inject(DataGridStore);

  ngOnInit(): void {
    this.rowData$.subscribe((rowData) => {
      const columns = this.columns();
      const options = this.options() || null;

      if (options?.view === 'table' && options?.rowNumber) {
        const found = columns.find((column) => column.field === 'rowNumber');

        if (!found) {
          columns.unshift({
            field: 'rowNumber',
            type: 'number',
            name: '순번',
          });
        }
      }

      if (options?.view === 'table' && options?.checkbox) {
        const found = columns.find((column) => column.field === 'checkbox');

        if (!found) {
          columns.unshift({
            field: 'checkbox',
            type: 'checkbox',
            name: '',
          });
        }
      }

      const pageInfo = this.pageInfo();

      rowData?.map((row, index) => {
        if (!row['uniqueId']) {
          row['uniqueId'] = index + 1;
        }

        // table 모드일 경우
        if (options?.view === 'table') {
          // rowNumber, checkbox 옵션 설정
          if (options?.rowNumber || !row['rowNumber']) {
            // pageInfo 여부에 따라 rowNumber 설정
            if (!pageInfo) {
              row['rowNumber'] = index + 1;
            } else {
              row['rowNumber'] = Math.max(
                1,
                (pageInfo?.totalItems || 0) -
                  (pageInfo?.pageSize || 0) * ((pageInfo?.pageNo || 0) - 1) -
                  index,
              );
            }
          }

          if (options?.checkbox || !row['checkbox']) {
            row['checkbox'] = false;
          }
        }
      });

      this.store.init({
        rowData,
        columns,
        options,
      });
    });
  }
}
