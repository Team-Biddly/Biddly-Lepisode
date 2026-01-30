import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import dayjs, { Dayjs } from 'dayjs';
import { debounceTime, map, Subject } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { BaseStore } from '../../stores/base.store';
import {
  CalendarCustomFormEventOutput,
  CalendarDayClickOutput,
  CalendarEvent,
  CalendarEventChangeOutput,
  CalendarMode,
  CalendarOptions,
  MONTH_LIST,
  TIME_LIST,
} from './calendar.types';

const DATA_KEY = 'malirang-calendar-key';

type State = {
  mode: CalendarMode;
  days: Dayjs[];
  value: Date;
  events: CalendarEvent[];
  options: CalendarOptions | null;
};

@Injectable({ providedIn: 'any' })
export class CalendarStore extends BaseStore<State> {
  readonly localStorageService = inject(LocalStorageService);

  readonly days$ = this.state$.pipe(map((state) => state.days));
  readonly value$ = this.state$.pipe(map((state) => state.value));
  readonly events$ = this.state$.pipe(map((state) => state.events));
  readonly mode$ = this.state$.pipe(map((state) => state.mode));
  readonly options$ = this.state$.pipe(map((state) => state.options));

  readonly days = toSignal(this.days$);
  readonly value = toSignal(this.value$);
  readonly events = toSignal(this.events$);
  readonly mode = toSignal(this.mode$);
  readonly options = toSignal(this.options$);

  readonly months = MONTH_LIST;
  readonly times = TIME_LIST;

  eventChange$ = new Subject<CalendarEventChangeOutput>();
  eventClick$ = new Subject<CalendarEvent>();
  dayClick$ = new Subject<CalendarDayClickOutput>();
  customFormEvent$ = new Subject<CalendarCustomFormEventOutput>();

  constructor() {
    super({
      mode: 'month',
      days: [],
      value: new Date(),
      events: [],
      options: null,
    });

    const defaultData = this.localStorageService.get<State>(DATA_KEY);
    if (defaultData) {
      this.updateState(defaultData);
    }

    this.state$.pipe(debounceTime(100)).subscribe((state) => {
      if (this.options()?.useLocalStorage) {
        this.localStorageService.set(DATA_KEY, state);
      } else {
        this.localStorageService.remove(DATA_KEY);
      }
    });
  }

  setMode(mode: CalendarMode) {
    this.updateState({ mode });
  }

  setValue(value: Date) {
    this.updateState({ value });
    this.generateDays();
  }

  setDays(days: Dayjs[]) {
    this.updateState({ days });
  }

  setEvents(events: CalendarEvent[]) {
    events.map((event, index) => {
      event.id = event.id ? event.id : (index + 1).toString();
      event.color = event.color || 'primary';
    });

    this.updateState({ events });
  }

  /**
   * @description 이벤트 클릭 시 발생하는 이벤트
   */
  eventClickEvent(event: CalendarEvent) {
    this.eventClick$.next(event);
  }

  /**
   * @description 날짜 클릭 시 발생하는 이벤트
   */
  dayClickEvent(event: CalendarDayClickOutput) {
    this.dayClick$.next(event);
  }

  /**
   * @description 이벤트 생성 (options.form === 'custom' 일 때)
   * @param date
   */
  customCreateEvent(date?: Date) {
    this.customFormEvent$.next({ date });
  }

  /**
   * @description 이벤트 수정 (options.form === 'custom' 일 때)
   * @param event
   */
  customUpdateEvent(event: CalendarEvent) {
    this.customFormEvent$.next({ event });
  }

  /**
   *  @description 이벤트 생성 (options.form !== 'custom' 일 때)
   * @param event
   */
  createEvent(event: CalendarEvent) {
    const events = this.events() || [];

    this.setEvents([...events, event]);
    this.eventChange$.next({ event, type: 'create' });
  }

  /**
   * @description 이벤트 수정 (options.form !== 'custom' 일 때)
   * @param event
   */
  updateEvent(event: CalendarEvent) {
    const events = this.events() || [];
    const updated = events.map((e) => {
      if (e.id === event.id) {
        return event;
      }

      return e;
    });

    this.setEvents(updated);
    this.eventChange$.next({ event, type: 'update' });
  }

  deleteEvent(event: CalendarEvent) {
    const events = this.events() || [];

    // 반복 이벤트가 아닐 때 (말이랑 전용 로직)
    if (!event.repeat) {
      const updated = events.filter((e) => e.id !== event.id);
      this.setEvents(updated);
    }

    this.eventChange$.next({ event, type: 'delete' });
  }

  copyEvent(event: CalendarEvent) {
    const events = this.events() || [];
    const copy = { ...event, id: `${events.length + 1}` };

    this.setEvents([...events, copy]);
    this.eventChange$.next({ copyEvent: copy, type: 'copy', event });
  }

  setOptions(options: CalendarOptions) {
    if (options.mode) {
      this.setMode(options.mode);
    }

    this.updateState({ options });
  }

  private generateDays() {
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

    this.setDays(days);
  }
}
