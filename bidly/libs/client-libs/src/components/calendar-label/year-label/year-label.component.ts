import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarYearSelect } from '../year-select/year-select.component';
import { ClickOutside } from 'ngxtension/click-outside';
import dayjs from 'dayjs';

@Component({
  selector: 'app-year-label',
  templateUrl: './year-label.component.html',
  imports: [CommonModule, CalendarYearSelect, ClickOutside],
})
export class YearLabel {
  value = input<Date>();
  yearOpen = signal(false);

  dateChange = output<Date>();

  /**
   * @description 년도를 선택했을 경우 이벤트 핸들링
   * @param ev
   */
  handleSelectYear(ev: Date) {
    const current = dayjs(this.value());
    const target = dayjs(ev);

    const value = current.set('year', target.get('year')).toDate();
    this.yearOpen.set(false);
    this.dateChange.emit(value);
  }
}
