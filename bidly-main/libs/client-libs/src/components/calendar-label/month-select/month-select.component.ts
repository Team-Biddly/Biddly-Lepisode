import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import dayjs from 'dayjs';
import { BaseConfig } from '../../common/config/config.adapter';
import { Menu } from '../../menu/menu.component';
import { MONTH_LIST } from '../../calendar/calendar.types';
import { YearLabel } from '../year-label/year-label.component';
import { Icon } from '../../icon/icon.component';

@Component({
  selector: 'app-month-select',
  styleUrls: ['./month-select.component.css'],
  standalone: true,
  imports: [CommonModule, Menu, YearLabel, Icon],
  template: `
    <app-menu>
      <div class="flex w-full justify-between px-4 py-2">
        <app-year-label
          [value]="date()!"
          (dateChange)="handleYearChange($event)"
        />

        <div class="flex gap-3 items-center">
          <button
            class="btn btn-ghost"
            (click)="handleNavigate('prev', 'year', 1)"
          >
            <app-icon name="ic:baseline-chevron-left" />
          </button>
          <button
            class="btn btn-ghost"
            (click)="handleNavigate('next', 'year', 1)"
          >
            <app-icon name="ic:baseline-chevron-right" />
          </button>
        </div>
      </div>
      <div class="grid grid-cols-4 px-4 py-2 gap-4">
        @for (month of months; track month) {
          <div
            (click)="handleSelect(month)"
            [attr.data-active]="active(month)"
            class="month-item theme-hover theme-text"
          >
            {{ month }}월
          </div>
        }
      </div>
    </app-menu>
  `,
})
export class CalendarMonthSelect extends BaseConfig {
  select = output<Date>();
  date = signal<Date | null>(new Date());
  value = input<Date | null>(null);
  months = MONTH_LIST;

  constructor() {
    super();

    effect(() => {
      if (this.value()) {
        this.date.set(this.value());
      }
    });
  }

  active(month: number) {
    return dayjs(this.date()).get('month') === month - 1;
  }

  /**
   * @description 년도와 달을 이동하는 통합 함수
   * @param type
   * @param unit
   * @param number
   */
  handleNavigate(
    type: 'prev' | 'next',
    unit: 'year' | 'month',
    number: number,
  ) {
    if (type === 'prev') {
      const value = dayjs(this.date()).subtract(number, unit).toDate();
      this.date.set(value);
    } else {
      const value = dayjs(this.date()).add(number, unit).toDate();
      this.date.set(value);
    }
  }

  /**
   * @description 년도와 달을 선택했을 경우 이벤트 핸들링
   * @param month
   */
  handleSelect(month: number) {
    const date = dayjs(this.date())
      .set('month', month - 1)
      .toDate();
    this.select.emit(date);
  }

  handleYearChange(ev: Date) {
    this.date.set(ev);
  }
}
