import { Component, HostBinding, input } from '@angular/core';
import { Icon } from '../../../icon/icon.component';
import { CalendarEvent } from '../../calendar.types';

@Component({
  selector: 'app-calendar-repeat-icon',
  template: `
    @if (event(); as event) {
      <app-icon
        name="solar:history-2-broken"
        size="sm"
        [attr.data-all-day]="event.allDay"
        class="icon"
      />
    }
  `,
  styleUrls: ['./repeat-icon.component.css'],
  imports: [Icon],
})
export class CalendarRepeatIcon {
  @HostBinding('class') class = 'flex h-full items-center';
  event = input.required<CalendarEvent>();
}
