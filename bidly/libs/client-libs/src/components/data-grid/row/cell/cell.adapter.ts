import {
  Component,
  HostBinding,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { BaseConfig } from '../../../common/config/config.adapter';
import { ColumnDefinition } from '../../types/colum-definition.type';
import { DataGridStore } from '../../data-grid.store';

@Component({
  selector: 'app-cell-adapter',
  template: '',
  standalone: true,
})
export class CellAdapter extends BaseConfig {
  readonly store = inject(DataGridStore);

  @HostListener('click', ['$event']) onClick(ev: any) {
    if (this.column()?.cellClickHandler) {
      ev.stopPropagation();
      ev.preventDefault();

      this.column()?.cellClickHandler!(this.row());
    }
  }

  @HostBinding('class') get class() {
    return this.column()?.style?.cellClass;
  }

  column = input.required<ColumnDefinition>();
  row = input.required<any>();
}
