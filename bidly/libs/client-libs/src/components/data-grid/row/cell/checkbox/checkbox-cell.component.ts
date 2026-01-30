import { Component, HostListener, model } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CellAdapter } from '../cell.adapter';
import { FormsModule } from '@angular/forms';

@Component({
  host: {
    ngSkipHydration: 'true',
  },
  selector: 'app-checkbox-cell',
  imports: [FormsModule],
  template: `
    <div class="flex justify-center">
      <input
        [(ngModel)]="value"
        (ngModelChange)="valueChange($event)"
        type="checkbox"
        class="rounded-md checkbox-primary border-neutral-300 checkbox"
      />
    </div>
  `,
})
export class CheckboxCell extends CellAdapter {
  @HostListener('click', ['$event']) handleClick(ev: MouseEvent) {
    ev.stopPropagation();
  }

  value = model<boolean>(false);
  selecteds = model<any[]>([]);
  selecteds$ = toObservable(this.selecteds);

  constructor() {
    super();

    // 선택된 row의 uniqueId를 가져와서 체크박스 선택 여부를 결정
    this.selecteds$.subscribe((selecteds) => {
      this.value.set(selecteds.includes(this.row()));
    });
  }

  /**
   * @description 체크박스 선택/해제
   * @param ev
   */
  valueChange(ev: boolean) {
    const array = this.selecteds() || [];

    if (ev) {
      this.selecteds.set([...(array || []), this.row()]);
    } else {
      this.selecteds.update((value) =>
        value.filter((obj) => {
          return obj['uniqueId'] != this.row()['uniqueId'];
        }),
      );
    }
  }
}
