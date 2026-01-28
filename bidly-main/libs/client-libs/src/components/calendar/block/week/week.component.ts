import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { DndDropEvent, DndDropzoneDirective } from 'ngx-drag-drop';
import { injectResize } from 'ngxtension/resize';
import { BaseConfig } from '../../../common/config/config.adapter';
import { CalendarService } from '../../calendar.service';
import { CalendarStore } from '../../calendar.store';
import {
  BLOCK_CALENDAR_DEFAULT_TOP,
  CalendarEvent,
  CalendarEventMenu,
} from '../../calendar.types';
import { BlockCalendarDay } from '../day/day.component';
import { BlockCalendarEvent } from '../event/event.component';

export type CustomDropEvent = {
  event: CalendarEvent;
  type: 'drop' | 'resize';
  date?: 'start' | 'end';
  time?: 'start' | 'end';
};

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.css'],
  standalone: true,
  imports: [BlockCalendarDay, BlockCalendarEvent, DndDropzoneDirective],
})
export class BlockCalendarWeek
  extends BaseConfig
  implements AfterViewInit, AfterViewChecked
{
  readonly store = inject(CalendarStore);
  readonly service = inject(CalendarService);

  events = this.store.events;
  options = this.store.options;

  days = input.required<Dayjs[]>();
  index = input.required<number>();

  weekRef = viewChild<ElementRef<HTMLElement>>('weekRef');
  eventRefs = viewChildren<BlockCalendarEvent>('eventRef');

  width = signal(0);
  resize$ = injectResize();

  isLoading = signal(false);

  // 모든 이벤트 중 현재 주에 해당하는 이벤트만 필터링
  renderEvents = computed<CalendarEvent[]>(() => {
    const array = this.events()!.filter((event) => {
      return this.days().some((day) => {
        return (
          dayjs(event.startDate).format('YYYY-MM-DD') ===
            day.format('YYYY-MM-DD') ||
          dayjs(event.endDate).format('YYYY-MM-DD') ===
            day.format('YYYY-MM-DD') ||
          (dayjs(event.startDate).isBefore(day) &&
            dayjs(event.endDate).isAfter(day))
        );
      });
    });

    // 종료일이 빠른 순으로 정렬
    const sortArray = array.sort((a, b) => {
      const aStartDate = dayjs(a.startDate);
      const bStartDate = dayjs(b.startDate);

      const aDiff = Number(aStartDate.format('YYMMDDHHmm'));
      const bDiff = Number(bStartDate.format('YYMMDDHHmm'));
      return aDiff - bDiff;
    });

    // 종일 이벤트를 위로 정렬
    return sortArray.sort((a, b) =>
      a.allDay && b.allDay ? 0 : a.allDay ? -1 : 1,
    );
  });

  // 이벤트 갯수에 따라 현재 주의 높이를 계산
  height = signal(0);

  ngAfterViewInit(): void {
    this.resize$.subscribe({
      next: () => {
        if (this.weekRef()) {
          this.width.set(this.weekRef()?.nativeElement?.offsetWidth || 0);
        }
      },
    });
  }

  ngAfterViewChecked(): void {
    this.handleEventTop();
  }

  /**
   * @description 마지막 이벤트의 top 위치를 계산하여 주의 높이를 조정
   */
  handleEventTop() {
    this.height.set(0);

    let top = 0;
    this.eventRefs().map((event, index) => {
      top = top > event.top() ? top : event.top();
    });

    const newHeight = top ? BLOCK_CALENDAR_DEFAULT_TOP + top : 160;
    this.height.set(newHeight > 160 ? newHeight : 160);
  }

  /**
   * @description 리사이즈 이벤트인지 드롭 이벤트인지 확인 후 핸들링
   * @param ev
   * @param day
   */
  drop(ev: DndDropEvent, day: Dayjs) {
    const data = ev.data as CustomDropEvent;

    this.store.setValue(day.toDate());

    if (data.type === 'drop') {
      if (!this.options()?.event?.drop) {
        return;
      }

      this.handleDrop(data, day);
    } else if (data.type === 'resize') {
      if (!this.options()?.event?.resize) {
        return;
      }

      this.handleResize(data, day);
    }
  }

  /**
   * 종일/시간포함 여부에 따라 시작일을 설정
   * @param event
   * @param day
   * @returns
   */
  handleStartDate(event: CalendarEvent, day: Dayjs) {
    if (!event.allDay) {
      return (event.startDate = dayjs(
        `${day.format('YYYY-MM-DD')} ${dayjs(event.startDate).format('HH:mm')}`,
      ).toDate());
    }

    return (event.startDate = day.toDate());
  }

  /**
   * 종일/시간포함 여부에 따라 종료일을 설정
   * @param event
   * @param day
   * @returns
   */
  handleEndDate(event: CalendarEvent, day: Dayjs) {
    if (!event.allDay) {
      return (event.endDate = dayjs(
        `${day.format('YYYY-MM-DD')} ${dayjs(event.endDate).format('HH:mm')}`,
      ).toDate());
    }

    return (event.endDate = day.toDate());
  }

  /**
   * @description 이벤트 리사이즈 핸들링 (시작일, 종료일)
   * @param ev
   * @param day
   */
  handleResize(ev: CustomDropEvent, day: Dayjs) {
    const events = this.events() || [];

    const update = events.map((event) => {
      if (event.id === ev.event.id) {
        if (ev.date === 'start') {
          event.startDate = this.handleStartDate(event, day);
        } else {
          event.endDate = this.handleEndDate(event, day);
        }
      }

      return event;
    });

    this.store.setEvents(update);

    // 이벤트가 리사이즈되었을 때, 부모 컴포넌트에게 이벤트를 전달
    const event = this.events()?.find((e) => e.id === ev.event.id)!;
    this.store.eventChange$.next({ event, type: 'resize' });
  }

  /**
   * @description 이벤트 드래그 앤 드랍 핸들링
   * @param data
   * @param day
   */
  handleDrop(data: CustomDropEvent, day: Dayjs) {
    const events = this.events() || [];

    events.map((event) => {
      if (event.id === data.event.id) {
        const diff = dayjs(event.endDate).diff(event.startDate, 'day');

        event.startDate = this.handleStartDate(event, day);
        event.endDate = this.handleEndDate(event, day.add(diff, 'day'));
      }
    });

    this.store.setEvents(events);

    // 이벤트가 드롭되었을 때, 부모 컴포넌트에게 이벤트를 전달
    const event = this.events()?.find((e) => e.id === data.event.id)!;
    this.store.eventChange$.next({ event, type: 'drop' });
  }

  /**
   * @description 이벤트 메뉴 핸들링
   * @param ev
   * @param event
   */
  handleEventMenu(ev: CalendarEventMenu, event: CalendarEvent) {
    this.service.handleEventMenu(ev, event);
  }
}
