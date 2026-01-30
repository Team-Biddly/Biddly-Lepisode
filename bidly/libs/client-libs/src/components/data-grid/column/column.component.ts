import { CdkMenu, CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, input, model, viewChild } from '@angular/core';
import { BaseConfig } from '../../common/config/config.adapter';
import { Align } from '../../common/types';
import { Menu } from '../../menu/menu.component';
import { MenuOption } from '../../menu/option/menu-option.component';
import { ColumnDefinition } from '../types/colum-definition.type';
import { CheckboxColumn } from './checkbox/checkbox-column.component';

@Component({
  host: {
    ngSkipHydration: 'true',
  },
  selector: '[gridColumn]',
  templateUrl: './column.component.html',
  styleUrls: ['../view/table/table.component.css'],
  imports: [CheckboxColumn, CdkMenuModule, Menu, MenuOption, CommonModule],
  standalone: true,
})
export class GridColumn extends BaseConfig {
  menu = viewChild(CdkMenu);

  showHeaderOption = input<boolean>(true);
  column = input.required<ColumnDefinition>();
  orderBy = model<string | null>(null);
  groupBy = model<string | null>(null);
  align = model<Align>('desc');
  selecteds = model<any[]>([]);

  handleGroupBy() {
    if (this.groupBy() === this.column().field) {
      this.groupBy.set(null);
    } else {
      this.groupBy.set(this.column().field);
    }
  }

  handleOrderBy(align: Align) {
    this.align.set(align);
    this.orderBy.set(this.column().alias || this.column().field);
  }
}
