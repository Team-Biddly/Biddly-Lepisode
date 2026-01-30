import { Component, computed, inject, input } from '@angular/core';
import { CalendarStore } from '../../calendar.store';
import dayjs from 'dayjs';
import { GridTable } from '../../../data-grid/view/table/table.component';
import { ColumnDefinition } from '../../../data-grid/types/colum-definition.type';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../calendar.types';

@Component({
  selector: 'app-event-date',
  template: `
    <div class="date">
      {{ startDate() }}
      @if (hasEndDate()) {
        ~ {{ endDate() }}
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
class CalendarEventDate {
  row = input<CalendarEvent>();
  column = input<ColumnDefinition>();

  startDate = computed(() => {
    const format = !this.row()?.allDay ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';

    return dayjs(this.row()?.startDate).format(format);
  });
  endDate = computed(() => {
    const format = !this.row()?.allDay ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';

    return dayjs(this.row()?.endDate).format(format);
  });

  hasEndDate = computed(() => {
    if (!this.row()?.allDay) return true;

    return (
      dayjs(this.row()?.startDate).format('YYYY-MM-DD') !==
      dayjs(this.row()?.endDate).format('YYYY-MM-DD')
    );
  });
}

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  standalone: true,
  imports: [GridTable],
})
export class CalendarEventList {
  readonly store = inject(CalendarStore);

  events = this.store.events;
  value = this.store.value;

  renderEvents = computed(() => {
    return this.events()?.filter((event) => {
      const date = dayjs(this.value());

      return (
        date.isSame(event.startDate, 'day') ||
        date.isSame(event.endDate, 'day') ||
        (date.isAfter(event.startDate, 'day') &&
          date.isBefore(event.endDate, 'day'))
      );
    });
  });

  columns: ColumnDefinition[] = [
    { type: 'text', field: 'title', name: '제목' },
    {
      type: 'custom',
      field: 'startDate',
      name: '날짜',
      renderItem: CalendarEventDate,
    },
  ];
}
