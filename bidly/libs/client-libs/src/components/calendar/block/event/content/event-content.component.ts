import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, effect, input } from '@angular/core';
import { CalendarHelper } from '../../../calendar.helper';
import { Icon } from '../../../../icon/icon.component';
import { CalendarEvent } from '../../../calendar.types';
import { CalendarRepeatIcon } from '../../../etc/repeat-icon/repeat-icon.component';

/**
 * @export BlockCalendarEventContent
 * @description 이벤트의 내용을 담당한다. 이벤트의 내용을 변경하고 싶다면 해당 컴포넌트를 참조
 */

@Component({
  selector: '[eventContent]',
  templateUrl: './event-content.component.html',
  standalone: true,
  imports: [DatePipe, Icon, CommonModule, CalendarRepeatIcon],
})
export class BlockCalendarEventContent {
  event = input.required<CalendarEvent>();
  width = input.required<number>();

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
