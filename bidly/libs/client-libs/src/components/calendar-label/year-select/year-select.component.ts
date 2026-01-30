import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import dayjs from 'dayjs';
import { MONTH_LIST } from '../../calendar/calendar.types';
import { BaseConfig } from '../../common/config/config.adapter';
import { Icon } from '../../icon/icon.component';
import { Menu } from '../../menu/menu.component';

@Component({
  selector: 'app-year-select',
  styleUrls: ['./year-select.component.css'],
  standalone: true,
  imports: [CommonModule, Icon, Menu],
  template: `
    <app-menu>
      <div class="flex w-full justify-between px-4 py-2">
        <p class="font-semibold theme-text text-base sm:text-lg">
          {{ firstYear() }}년 - {{ lastYear() }}년
        </p>
        <div class="flex gap-3 items-center">
          <button
            class="btn btn-ghost"
            (click)="handleNavigate('prev', 'year', 10)"
          >
            <app-icon name="ic:baseline-chevron-left" />
          </button>
          <button
            class="btn btn-ghost"
            (click)="handleNavigate('next', 'year', 10)"
          >
            <app-icon name="ic:baseline-chevron-right" />
          </button>
        </div>
      </div>
      <div class="grid grid-cols-4 px-4 py-2 gap-4">
        @for (year of yearItems(); track year) {
          <div
            (click)="handleSelect(year)"
            [attr.data-active]="active(year)"
            class="year-item theme-hover theme-text"
          >
            {{ year }}년
          </div>
        }
      </div>
    </app-menu>
  `,
})
export class CalendarYearSelect extends BaseConfig {
  select = output<Date>();
  value = input<Date | null>(null);
  date = signal<Date | null>(new Date());
  months = MONTH_LIST;

  yearItems = computed(() => {
    const value = this.date();

    if (!value) return [];

    const base = dayjs(value).format('YYYY').substring(0, 3);

    const start = dayjs(`${base}0`).year();
    const end = dayjs(`${base}9`).year();

    const result = [];

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    return result;
  });

  firstYear = computed(() => this.yearItems()[0]);
  lastYear = computed(() => this.yearItems()[this.yearItems().length - 1]);

  constructor() {
    super();

    effect(() => {
      if (this.value()) {
        this.date.set(this.value());
      }
    });
  }

  active(year: number) {
    return dayjs(this.date()).get('year') === year;
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
  handleSelect(year: number) {
    const date = dayjs(this.date()).set('year', year).toDate();
    this.select.emit(date);
  }
}
