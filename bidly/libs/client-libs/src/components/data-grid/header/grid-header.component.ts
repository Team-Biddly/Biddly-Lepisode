import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, model } from '@angular/core';
import dayjs from 'dayjs';
import { get } from '../../../helpers/object-get';
import { ExcelService } from '../../../services/excel.service';
import { BaseConfig } from '../../common/config/config.adapter';
import { Align } from '../../common/types';
import { Icon } from '../../icon/icon.component';
import { InputDirective } from '../../input/input.directive';
import { Menu } from '../../menu/menu.component';
import { MenuOption } from '../../menu/option/menu-option.component';
import { DataGridStore } from '../data-grid.store';
import { ColumnDefinition } from '../types/colum-definition.type';

@Component({
  selector: 'app-grid-header',
  templateUrl: './grid-header.component.html',
  styleUrls: ['../mode/ssp/ssp-data-grid.component.css'],
  standalone: true,
  imports: [
    Icon,
    CdkMenuModule,
    Menu,
    MenuOption,
    InputDirective,
    CommonModule,
  ],
})
export class GridHeader extends BaseConfig {
  readonly excelService = inject(ExcelService);
  readonly store = inject(DataGridStore);

  orderBy = model<string>();
  align = model<Align>();
  query = model<string>('');

  columns = input.required<ColumnDefinition[]>();
  rowData = input<any[] | undefined>([]);
  selecteds = model<any[]>([]);

  options = this.store.tableOptions;

  aligns: Align[] = ['asc', 'desc'];

  // 현재 정렬 상태
  currentOrderBy = computed(() => {
    const column = this.columns().find(
      (column) => (column.alias || column.field) === this.orderBy(),
    );

    return column?.name || '';
  });

  handleOrderBy(align: Align, orderBy: string) {
    this.align.set(align);
    this.orderBy.set(orderBy);
  }

  /**
   * @description Excel로 내보낼 데이터를 세팅합니다.
   * @returns { Array<any> }
   */
  getExportData() {
    const data = this.rowData();
    const columns = this.columns().filter(
      (column) => column.type !== 'checkbox',
    );

    if (!data) return [];

    const array = data.map((item) => {
      const temp = {} as any;
      for (const [index, column] of columns.entries()) {
        const value = get(item, column.field);
        let current = '';

        if (column.type === 'date') {
          current = dayjs(value).format('YYYY-MM-DD');
        } else if (column.type === 'boolean' || column.type === 'enum') {
          current = (column.badgeProps as any)[value]?.text;
        } else if (column.type === 'number') {
          const pipe = new DecimalPipe('en-US');
          current = pipe.transform(value) || '0';
        } else {
          current = value;
        }

        if (column.formatter) {
          current = column.formatter(current);
        }

        temp[column.name] = current;
      }
      return temp;
    });

    return array.filter((item) => item);
  }

  /**
   * @description Export 할 데이터 세팅 후 Excel로 내보냅니다.
   */
  exportExcel() {
    const data = this.getExportData();
    this.excelService.exportAsExcelFile(data);
  }
}
