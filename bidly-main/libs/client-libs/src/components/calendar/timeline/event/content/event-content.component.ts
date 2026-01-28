import { Component, computed, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarEvent } from '../../../calendar.types';
import { CalendarRepeatIcon } from '../../../etc/repeat-icon/repeat-icon.component';
import { Icon } from '../../../../icon/icon.component';
import { CalendarHelper } from '../../../calendar.helper';

/**
 * @export TimelineCalendarEventContent
 * @description 이벤트의 내용을 담당한다. 이벤트의 내용을 변경하고 싶다면 해당 컴포넌트를 참조
 */

@Component({
  selector: '[timelineEventContent]',
  templateUrl: './event-content.component.html',
  standalone: true,
  imports: [DatePipe, Icon, CommonModule, CalendarRepeatIcon],
})
export class TimelineCalendarEventContent {
  event = input.required<CalendarEvent>();

  currentColor = computed(() => {
    if (this.event()?.allDay) {
      return this.event()?.color;
    }

    return CalendarHelper.convertToShade(this.event()?.color || '#000000');
  });

  getTextColor = computed(() =>
    CalendarHelper.getContrastColor(this.currentColor() || '#000000'),
  );
}
