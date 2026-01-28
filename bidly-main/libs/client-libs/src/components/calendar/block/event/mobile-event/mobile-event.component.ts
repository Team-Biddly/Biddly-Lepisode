import { Component, computed, inject, input } from '@angular/core';
import { Dayjs } from 'dayjs';
import { CalendarStore } from '../../../calendar.store';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-block-calendar-mobile-event',
  templateUrl: './mobile-event.component.html',
  standalone: true,
  imports: [DecimalPipe],
})
export class BlockCalendarMobileEvent {
  readonly store = inject(CalendarStore);

  events = this.store.events;
  day = input.required<Dayjs>();

  hasEventLength = computed(() => {
    return this.events()?.filter((event) => {
      return (
        this.day().isSame(event.startDate, 'day') ||
        this.day().isSame(event.endDate, 'day') ||
        (this.day().isAfter(event.startDate, 'day') &&
          this.day().isBefore(event.endDate, 'day'))
      );
    }).length;
  });
}
