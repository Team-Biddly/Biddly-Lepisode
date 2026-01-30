import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { BaseConfig } from '../common/config/config.adapter';
import { BlockCalendar } from './block/block-calendar.component';
import { CalendarService } from './calendar.service';
import { CalendarStore } from './calendar.store';
import {
  CalendarCustomFormEventOutput,
  CalendarDayClickOutput,
  CalendarEvent,
  CalendarEventChangeOutput,
  CalendarMode,
  CalendarOptions,
} from './calendar.types';
import { CalendarHeader } from './etc/header/calendar-header.component';
import { TimelineCalendar } from './timeline/timeline-calendar.component';
import { toObservable } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';

@Component({
  host: {
    ngSkipHydration: 'true',
  },
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, CalendarHeader, TimelineCalendar, BlockCalendar],
  templateUrl: './calendar.component.html',
  providers: [CalendarStore, CalendarService],
})
export class Calendar extends BaseConfig implements OnInit {
  readonly store = inject(CalendarStore);

  /**
   * @description 날짜가 클릭되었을 때 발생하는 이벤트
   */
  dayClick = output<CalendarDayClickOutput>();

  /**
   * @description 이벤트가 클릭되었을 때 발생하는 이벤트
   */
  eventClick = output<CalendarEvent>();

  /**
   * @description 이벤트가 등록,수정,삭제,복제,드롭 되었을 때 발생하는 이벤트
   */
  eventChange = output<CalendarEventChangeOutput>();

  /**
   * @description 사용자 정의 폼 이벤트(options의 form이 custom일 경우 사용)
   */
  customFormEvent = output<CalendarCustomFormEventOutput>();

  events = input<CalendarEvent[]>([]);
  events$ = toObservable(this.events);

  options = input<CalendarOptions>();
  options$ = toObservable(this.options);

  value = this.store.value;

  date = model<Date>(new Date());
  mode = model<CalendarMode>();

  ngOnInit(): void {
    this.events$.subscribe({
      next: (events) => {
        this.store.setEvents(events);
      },
    });

    this.options$.subscribe({
      next: (options) => {
        this.store.setOptions(options || {});
      },
    });

    this.store.setValue(this.value() || new Date());

    this.store.eventChange$.subscribe({
      next: (change) => {
        this.eventChange.emit(change);
      },
    });

    this.store.customFormEvent$.subscribe({
      next: (ev) => {
        this.customFormEvent.emit(ev);
      },
    });

    this.store.eventClick$.subscribe({
      next: (ev) => {
        this.eventClick.emit(ev);
      },
    });

    this.store.dayClick$.subscribe({
      next: (ev) => {
        this.dayClick.emit(ev);
      },
    });

    this.store.value$.subscribe({
      next: (value) => {
        this.handleCurrentDate(value);
      },
    });
  }

  /**
   * mode에 따라서 바뀐 날짜를 처리할지 말지 결정합니다.
   * @param value
   * @returns
   */
  handleCurrentDate(value: Date) {
    if (!value || !this.mode()) return;

    switch (this.mode()) {
      case 'day': {
        const date = dayjs(this.date());
        const nextDate = dayjs(value);

        if (date.isSame(nextDate, 'day')) {
          return;
        }

        this.date.set(value);

        break;
      }

      case 'week': {
        const date = dayjs(this.date());
        const nextDate = dayjs(value);

        if (date.isSame(nextDate, 'week')) {
          return;
        }

        this.date.set(value);

        break;
      }

      case 'month': {
        const date = dayjs(this.date());
        const nextDate = dayjs(value);

        if (date.format('YYYY-MM') === nextDate.format('YYYY-MM')) {
          return;
        }

        this.date.set(value);

        break;
      }
    }
  }
}
