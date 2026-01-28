import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { ClickOutside } from 'ngxtension/click-outside';
import { CalendarMonthSelect } from '../month-select/month-select.component';

@Component({
  selector: 'app-month-label',
  templateUrl: './month-label.component.html',
  imports: [CommonModule, CalendarMonthSelect, ClickOutside],
})
export class MonthLabel {
  dateChange = output<Date>();
  value = input<Date>();
  monthOpen = signal(false);

  /**
   * @description 달을 선택했을 경우 이벤트 핸들링
   * @param ev
   */
  handleSelectMonth(ev: Date) {
    this.monthOpen.set(false);
    this.dateChange.emit(ev);
  }
}
