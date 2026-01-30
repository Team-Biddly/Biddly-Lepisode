import { Component } from '@angular/core';
import {
  Calendar,
  CalendarEvent,
  CalendarEventChangeOutput,
  CalendarOptions,
} from '@client-libs';
import dayjs from 'dayjs';

@Component({
  selector: 'app-calendar-docs',
  templateUrl: './calendar.page.html',
  imports: [Calendar],
  standalone: true,
})
export default class CalendarDocs {
  events: CalendarEvent[] = [
    {
      startDate: dayjs('2025-03-01 01:00').toDate(),
      endDate: dayjs('2025-03-01 02:00').toDate(),
      title: 'Event 1',
      color: '#032cfc',
    },
    {
      startDate: dayjs('2025-03-01 02:00').toDate(),
      endDate: dayjs('2025-03-01 03:00').toDate(),
      title: 'Event 1 Copy',
      color: '#032cfc',
    },
    {
      startDate: dayjs('2025-03-01 01:00').toDate(),
      endDate: dayjs('2025-03-01 03:00').toDate(),
      title: 'Event 11',
      color: '#032cfc',
    },
    {
      startDate: dayjs('2025-03-03').toDate(),
      endDate: dayjs('2025-03-05').toDate(),
      title: '3~5',
      color: '#fc0303',
      allDay: true,
    },
    {
      startDate: dayjs('2025-03-03 01:00').toDate(),
      endDate: dayjs('2025-03-03 02:00').toDate(),
      title: 'Event 3',
      color: '#fc0303',
    },
    {
      startDate: dayjs('2025-03-03 01:00').toDate(),
      endDate: dayjs('2025-03-03 02:00').toDate(),
      title: 'Event 4',
      color: '#fc0303',
    },
    {
      startDate: dayjs('2025-03-08 04:00').toDate(),
      endDate: dayjs('2025-03-08 07:00').toDate(),
      title: 'Event 22',
      color: '#fc0303',
    },
    {
      startDate: dayjs('2025-03-07').toDate(),
      endDate: dayjs('2025-03-10').toDate(),
      title: '7~10',
      color: '#cf03fc',
    },
    {
      startDate: dayjs('2024-11-30').toDate(),
      endDate: dayjs('2025-03-2').toDate(),
      title: '30~2',
      color: '#cf03fc',
    },
    {
      startDate: dayjs('2025-03-05').toDate(),
      endDate: dayjs('2025-03-05').toDate(),
      title: '30',
      color: '#cf03fc',
    },
  ];

  calendarOptions: CalendarOptions = {
    event: {
      drop: true,
      resize: true,
      create: true,
      copy: true,
      update: true,
      delete: true,
    },
  };

  change(ev: CalendarEventChangeOutput) {}
}
