import { Component, inject, model } from '@angular/core';
import { DataGridStore } from '../../data-grid.store';
import { Checkbox } from '../../../checkbox/checkbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  host: {
    ngSkipHydration: 'true',
  },
  selector: 'app-checkbox-column',
  standalone: true,
  template: `
    <div class="flex justify-center">
      <input
        [(ngModel)]="value"
        (ngModelChange)="valueChange($event)"
        type="checkbox"
        checked="checked"
        class="rounded-md checkbox-primary border-neutral-300 checkbox"
      />
    </div>
  `,
  imports: [Checkbox, FormsModule],
})
export class CheckboxColumn {
  readonly store = inject(DataGridStore);

  value = model<boolean>(false);
  selecteds = model<any[]>([]);

  /**
   * @description 전체 선택/해제
   * @param ev
   */
  valueChange(ev: boolean) {
    const rowData = this.store.rowData() || [];

    if (ev) {
      this.selecteds.set(rowData);
    } else {
      this.selecteds.set([]);
    }
  }
}
