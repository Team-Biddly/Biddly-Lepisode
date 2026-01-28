import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { DndDropEvent, DndDropzoneDirective } from 'ngx-drag-drop';
import { TimelineEventWrapper } from '../event-wrapper/event-wrapper.component';
import { TimelineAdapter } from './timeline.adapter';
import { CustomDropEvent } from '../../block/week/week.component';
import {
  CalendarEvent,
  CalendarEventMenu,
  TimelineSlot,
} from '../../calendar.types';
import { TimePipe } from '../../../../pipes/time.pipe';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  standalone: true,
  imports: [CommonModule, TimelineEventWrapper, DndDropzoneDirective, TimePipe],
})
export class Timeline extends TimelineAdapter {
  time = input.required<string>();
  days = input.required<Dayjs[]>();
  last = input.required<boolean>();
  slots = input.required<TimelineSlot[]>();

  /**
   * @description 이번 달에 해당하는 이벤트만 필터링합니다.
   */
  currentEvents = computed(() => {
    if (!this.days() || this.days()?.length === 0) return [];

    return this.events()?.filter((ev) => {
      return this.days()?.find((day) => {
        return (
          dayjs(ev.startDate).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
        );
      });
    });
  });

  /**
   * @description 조건에따라 이벤트를 필터링합니다.
   */
  renderEvents = computed(() => {
    return this.currentEvents()?.filter((event) => {
      const flag1 =
        dayjs(event.startDate).format('YYYY-MM') ===
        dayjs(event.endDate).format('YYYY-MM');
      const flag2 = dayjs(event.startDate).format('HH:00') === this.time();
      const flag3 = dayjs(event.endDate).diff(event.startDate, 'day') === 0;
      const flag4 = !event.allDay;

      return flag1 && flag2 && flag3 && flag4;
    });
  });

  menu(ev: [CalendarEventMenu, CalendarEvent]) {
    this.handleEventMenu(ev[0], ev[1]);
  }

  /**
   * @description 리사이즈 이벤트인지 드롭 이벤트인지 확인 후 핸들링
   * @param ev
   * @param day
   */
  drop(ev: DndDropEvent, day: Dayjs) {
    const data = ev.data as CustomDropEvent;
    const options = this.store.options();

    this.store.setValue(day.toDate());

    if (data.type === 'drop') {
      if (!options?.event?.drop) {
        return;
      }

      this.handleDrop(data);
    } else if (data.type === 'resize') {
      if (!options?.event?.resize) {
        return;
      }

      this.handleResize(data);
    }
  }

  /**
   * @description 드롭 이벤트 핸들링
   */
  handleDrop(data: CustomDropEvent): void {
    const { event } = data;

    const diff = dayjs(event.endDate).diff(event.startDate, 'hour');
    const startDate = dayjs(
      `${dayjs(event.startDate).format('YYYY-MM-DD')} ${this.time()}`,
    );
    const endDate = startDate.add(diff, 'hour');

    event.startDate = startDate.toDate();
    event.endDate = endDate.toDate();

    const events = this.events()?.map((ev) => {
      if (ev.id === event.id) {
        return event;
      }

      return ev;
    });

    this.store.setEvents(events!);

    const currentEvent = this.events()?.find((ev) => ev.id === event.id);
    this.store.eventChange$.next({
      type: 'drop',
      event: currentEvent!,
    });
  }

  /**
   * @description 리사이즈 이벤트 핸들링
   */
  handleResize(data: CustomDropEvent): void {
    const { event, time } = data;

    if (!event) return;

    if (time === 'start') {
      event.startDate = dayjs(
        `${dayjs(event.startDate).format('YYYY-MM-DD')} ${this.time()}`,
      ).toDate();
    } else {
      event.endDate = dayjs(
        `${dayjs(event.endDate).format('YYYY-MM-DD')} ${this.time()}`,
      ).toDate();
    }

    const events = this.events()?.map((ev) => {
      if (ev.id === event.id) {
        return event;
      }

      return ev;
    });

    this.store.setEvents(events!);

    const currentEvent = this.events()?.find((ev) => ev.id === event.id);
    this.store.eventChange$.next({
      type: 'resize',
      event: currentEvent!,
    });
  }
}
