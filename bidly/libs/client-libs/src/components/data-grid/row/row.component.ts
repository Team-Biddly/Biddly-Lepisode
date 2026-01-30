import { CdkMenuModule } from '@angular/cdk/menu';
import { Component, computed, signal } from '@angular/core';
import { ClickOutside } from 'ngxtension/click-outside';
import { Menu } from '../../menu/menu.component';
import { MenuOption } from '../../menu/option/menu-option.component';
import { GridCell } from './cell/cell.component';
import { RowAdapter } from './row.adapter';

@Component({
  host: {
    ngSkipHydration: 'true',
  },
  selector: '[gridRow]',
  templateUrl: './row.component.html',
  styleUrls: ['../view/table/table.component.css'],
  standalone: true,
  imports: [GridCell, CdkMenuModule, Menu, MenuOption, ClickOutside],
})
export class GridRow extends RowAdapter {
  // 체크박스 선택 여부
  selected = computed(() =>
    this.selectedIds()?.includes(this.row()['uniqueId']),
  );

  active = computed(() => {
    if (this.options()?.row?.active) {
      return this.options()!.row!.active!(this.row());
    }

    return false;
  });

  open = signal(false);
}
