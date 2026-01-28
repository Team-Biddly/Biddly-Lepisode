import { Component, computed, inject } from '@angular/core';
import dayjs from 'dayjs';
import { BaseConfig } from '../../common/config/config.adapter';
import { CalendarStore } from '../calendar.store';
import { TimelineSlot } from '../calendar.types';
import { AllDayTimeline } from './all-day-timeline/all-day-timeline.component';
import { TimelineDay } from './day/timeline-day.component';
import { Timeline } from './timeline/timeline.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-calendar',
  templateUrl: './timeline-calendar.component.html',
  styleUrls: ['./timeline-calendar.component.css'],
  standalone: true,
  imports: [TimelineDay, Timeline, AllDayTimeline, CommonModule],
})
export class TimelineCalendar extends BaseConfig {
  readonly store = inject(CalendarStore);

  mode = this.store.mode;
  days = this.store.days;
  value = this.store.value;
  times = this.store.times;
  events = this.store.events;
  events$ = this.store.events$;

  /**
   * @description 시간별 일정을 배치하기 위한 슬롯 배열
   */
  slots = computed<TimelineSlot[]>(() => {
    const slots: TimelineSlot[] = [];

    this.events()?.map((ev) => {
      const startTime = dayjs(ev.startDate);
      const endTime = dayjs(ev.endDate);

      const diff = Math.round(
        Number(endTime.format('HH')) - Number(startTime.format('HH')),
      );

      for (let i = 0; i <= diff; i++) {
        const found = slots.find(
          (slot) =>
            slot.time === startTime.add(i, 'hour').format('HH:00') &&
            slot.day === dayjs(ev.startDate).format('DD'),
        );

        if (!found) {
          const slot: TimelineSlot = {
            time: startTime.add(i, 'hour').format('HH:00'),
            day: dayjs(ev.startDate).format('DD'),
            events: [ev],
          };

          slots.push(slot);
        } else {
          found.events.push(ev);
        }
      }
    });

    return slots.map((slot) => {
      return {
        ...slot,
        events: slot.events.sort((a, b) => {
          return a.startDate > b.startDate ? 1 : -1;
        }),
      };
    });
  });

  renderDays = computed(() => {
    if (this.mode() === 'day') {
      return [dayjs(this.value())];
    }

    if (this.mode() === 'week') {
      const weekDays = [];
      const today = dayjs(this.value());
      const start = today.startOf('week');
      for (let i = 0; i <= 6; i++) {
        const date = start.add(i, 'day');
        weekDays.push(date);
      }

      return weekDays;
    }

    const day = dayjs(this.value());

    return this.days()?.filter((d) => {
      return d.format('YYYY-MM') === day.format('YYYY-MM');
    });
  });
}
