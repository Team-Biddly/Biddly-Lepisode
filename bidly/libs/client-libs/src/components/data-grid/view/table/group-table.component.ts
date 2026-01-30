import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { GridColumn } from '../../column/column.component';
import { GridRow } from '../../row/row.component';
import { GridViewAdapter } from '../view.adapter';

@Component({
  selector: 'app-grid-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true,
  imports: [GridRow, GridColumn, CommonModule],
})
export class GridGroupTable extends GridViewAdapter {
  groupBy = this.store.groupBy;

  groupData = computed(() => {
    if (!this.groupBy()) return;

    const groupBy = this.groupBy()!;
    const data = this.rowData();

    return data?.reduce(
      (acc, cur) => {
        const key = cur[groupBy];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(cur);
        return acc;
      },
      {} as Record<string, any[]>,
    );
  });
}
