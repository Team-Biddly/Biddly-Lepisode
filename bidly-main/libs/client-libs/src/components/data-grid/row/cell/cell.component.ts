import { Component, computed, input, model } from '@angular/core';
import { ColumnDefinition } from '../../types/colum-definition.type';
import { BadgeCell } from './badge/badge-cell.component';
import { CheckboxCell } from './checkbox/checkbox-cell.component';
import { CustomCell } from './custom/custom-cell.component';
import { TextCell } from './text/text-cell.component';

@Component({
  host: {
    ngSkipHydration: 'true',
  },
  selector: '[gridCell]',
  templateUrl: './cell.component.html',
  styleUrls: ['../../view/table/table.component.css'],
  standalone: true,
  imports: [TextCell, BadgeCell, CheckboxCell, CustomCell],
})
export class GridCell {
  column = input.required<ColumnDefinition>();
  row = input.required<any>();
  selecteds = model<any[]>([]);

  // 셀 타입에 따라 다른 컴포넌트를 렌더링
  rowType = computed(() => {
    if (!this.column()) return;

    const column = this.column();

    switch (column.type) {
      case 'text':
      case 'number':
      case 'date':
        return 'text';
      case 'enum':
      case 'boolean':
        return 'badge';
      case 'custom':
        return 'custom';
      default:
        return 'checkbox';
    }
  });
}
