/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import dayjs from 'dayjs';
import { get } from '../../../../../helpers/object-get';
import { ToastService } from '../../../../../services/toast.service';
import { DateColumnDefinition } from '../../../types/colum-definition.type';
import { CellAdapter } from '../cell.adapter';

@Component({
  selector: 'app-text-cell',
  template: `
    <div
      class="flex gap-2 items-center"
      (mouseover)="hover.set(true)"
      (mouseout)="hover.set(false)"
    >
      <p [ngClass]="column()?.style?.cellClass">{{ content() }}</p>

      @if (
        content() && column().type !== 'date' && column().field !== 'rowNumber'
      ) {
        <app-icon-button
          [ngClass]="hover() ? 'visible' : 'invisible'"
          size="sm"
          (click)="handleCopyContent($event)"
          icon="material-symbols:content-copy-outline"
        />
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class TextCell extends CellAdapter {
  readonly toastService = inject(ToastService);

  hover = signal(false);

  /**
   * @description column의 type에 따라 셀 내용을 반환합니다.
   */
  content = computed(() => {
    if (!this.column()) return;

    const __value = get(this.row(), this.column().field, '');

    // formatter 처리
    const _value = this.column()?.formatter
      ? this.column().formatter!(__value, this.row())
      : __value;

    // pipe 처리
    const value = this.column()?.pipe
      ? this.column().pipe!.transform(_value)
      : _value;

    switch (this.column().type) {
      case 'text': {
        if (!value) return '-';
        return value;
      }
      case 'number': {
        return new DecimalPipe('en-US').transform(value);
      }
      case 'date': {
        const column = this.column() as DateColumnDefinition;
        return dayjs(value).format(column.format || 'YYYY-MM-DD');
      }
    }
  });

  /**
   * @description 셀 내용을 클립보드에 복사합니다.
   */
  handleCopyContent(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();

    navigator.clipboard.writeText(this.content());
    this.toastService.info('클립보드에 복사되었습니다.');
  }
}
