import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { AllDayTimelineEvent } from '../all-day-event/all-day-event.component';
import { TimelineAdapter } from '../timeline/timeline.adapter';

dayjs.extend(isBetween);

@Component({
  selector: 'app-all-day-timeline',
  templateUrl: './all-day-timeline.component.html',
  styleUrls: ['./all-day-timeline.component.css'],
  standalone: true,
  imports: [AllDayTimelineEvent, CommonModule],
})
export class AllDayTimeline extends TimelineAdapter {
  days = input.required<Dayjs[]>();

  /**
   * @description 종일 이벤트만 필터링
   */
  renderEvents = computed(() => {
    const reuslt = this.events()?.filter((event) => {
      const found = this.days()?.find((day) => {
        const diff = dayjs(event.endDate).diff(event.startDate, 'day');
        for (let i = 0; i <= diff; i++) {
          const date = dayjs(event.startDate).add(i, 'day');
          if (day.format('YY-MM-DD') === date.format('YY-MM-DD')) {
            return true;
          }
        }

        return false;
      });

      return (
        found &&
        (event.allDay || dayjs(event.endDate).diff(event.startDate, 'day') > 0)
      );
    });

    return reuslt?.sort((a, b) => {
      return dayjs(a.startDate).diff(b.startDate);
    });
  });

  height = computed(() => {
    if (this.renderEvents()!.length <= 3) {
      return 160;
    }

    return this.renderEvents()!.length * 48;
  });
}
