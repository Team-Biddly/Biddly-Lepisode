import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';

import { CommonModule } from '@angular/common';
import {
  ControlValueAccessorAdpater,
  controlValueAccessorProvider,
} from '../../../common/value-accessor';
import { Icon } from '../../../icon/icon.component';
import { Day } from './day/day.component';
import { toObservableSignal } from 'ngxtension/to-observable-signal';

@Component({
  selector: 'app-pick-calendar',
  templateUrl: './pick-calendar.component.html',
  styleUrls: ['./pick-calendar.component.css'],
  imports: [CommonModule, Day, Icon],
  providers: [controlValueAccessorProvider(PickCalendar)],
})
export class PickCalendar
  extends ControlValueAccessorAdpater<Date>
  implements OnInit, AfterViewInit
{
  private readonly changeRef = inject(ChangeDetectorRef);

  currentDate = computed(() => this.value() || new Date());
  years = signal<number[]>([]);
  year = toObservableSignal(computed(() => this.currentDate().getFullYear()));

  days = computed(() => {
    const days: Dayjs[] = [];
    const current = dayjs(this.value());

    const firstDayOfMonth = current.startOf('month');
    const lastDayOfMonth = current.endOf('month');
    const daysInMonth = current.daysInMonth();

    // Add days from the previous month to fill the first week
    for (let i = firstDayOfMonth.day() - 1; i >= 0; i--) {
      days.push(firstDayOfMonth.subtract(i + 1, 'day'));
    }

    // Add days of the current month
    for (let i = 0; i < daysInMonth; i++) {
      days.push(firstDayOfMonth.add(i, 'day'));
    }

    // Add days from the next month to fill the last week
    for (let i = 1; i <= 6 - lastDayOfMonth.day(); i++) {
      days.push(lastDayOfMonth.add(i, 'day'));
    }

    return days;
  });

  ngOnInit(): void {
    for (let i = 1900; i < 2100; i++) {
      this.years().push(i);
    }
  }

  ngAfterViewInit(): void {
    this.handleScroll(this.year());

    this.year.subscribe({
      next: (year) => {
        if (year && year.toString()?.length === 4) {
          this.handleScroll(year);
        }
      },
    });
  }

  handleScroll(year: number) {
    const carousel = document.getElementById('carousel');
    if (carousel) {
      const currentYear = document.getElementById(`${year}`);
      currentYear?.scrollIntoView();
    }
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
      const value = dayjs(this.value()).subtract(number, unit).toDate();
      this.writeValue(value);
    } else {
      const value = dayjs(this.value()).add(number, unit).toDate();
      this.writeValue(value);
    }
  }

  handleSelectDay(day: Dayjs) {
    this.writeValue(day.toDate());
  }

  handleSelectYear(year: number) {
    const value = dayjs(this.value()).set('year', year).toDate();
    this.writeValue(value);
  }
}
