import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MonthLabel } from './month-label/month-label.component';
import { YearLabel } from './year-label/year-label.component';

@Component({
  selector: 'app-calendar-label',
  templateUrl: './calendar-label.component.html',
  imports: [CommonModule, YearLabel, MonthLabel],
})
export class CalendarLabel {
  dateChange = output<Date>();
  value = input<Date | undefined>(new Date()); // 현재 선택된 날짜
}
