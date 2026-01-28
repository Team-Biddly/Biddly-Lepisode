import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import dayjs from 'dayjs';
import { BaseConfig } from '../../common/config/config.adapter';
import { CalendarStore } from '../calendar.store';
import { BlockCalendarWeek } from './week/week.component';
import { CalendarEventList } from '../etc/event-list/event-list.component';

@Component({
  selector: 'app-block-calendar',
  templateUrl: './block-calendar.component.html',
  styleUrls: ['./block-calendar.component.css'],
  standalone: true,
  imports: [BlockCalendarWeek, CommonModule, CalendarEventList],
})
export class BlockCalendar extends BaseConfig {
  readonly store = inject(CalendarStore);

  days = this.store.days;
  mode = this.store.mode;
  value = this.store.value;
  options = this.store.options;

  /**
   * @description mode에 따라서 렌더링할 날짜를 결정한다.
   */
  renderDays = computed(() => {
    const days = this.days() || [];
    const result = [];

    if (this.mode() === 'week') {
      const weekDays = [];
      const today = dayjs(this.value());
      const start = today.startOf('week');
      for (let i = 0; i <= 6; i++) {
        const date = start.add(i, 'day');
        weekDays.push(date);
      }

      result.push(weekDays);
    } else {
      for (let i = 0; i < days.length; i++) {
        if (i % 7 === 0) {
          result.push(days.slice(i, i + 7));
        }
      }
    }

    return result;
  });
}
