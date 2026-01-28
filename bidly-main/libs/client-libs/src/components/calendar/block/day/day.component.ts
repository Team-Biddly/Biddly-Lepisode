import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  HostBinding,
  HostListener,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import dayjs from 'dayjs';
import { Icon } from '../../../icon/icon.component';
import { DayAdapter } from '../../adapters/day.adapter';
import { CalendarService } from '../../calendar.service';
import { BlockCalendarMobileEvent } from '../event/mobile-event/mobile-event.component';

@Component({
  selector: 'app-day',
  imports: [CommonModule, BlockCalendarMobileEvent, Icon],
  standalone: true,
  styleUrls: ['./day.component.css'],
  templateUrl: './day.component.html',
})
export class BlockCalendarDay extends DayAdapter {
  @HostListener('click') click() {
    // 이전 달의 날짜를 클릭했을 때
    // options.day.selected가 false일 때는 클릭이 되지 않도록 한다.
    if (!this.options()?.day?.selected && this.type() === 'prev-month') {
      return;
    }

    const events = this.events() || [];

    this.store.dayClickEvent({
      date: this.day().toDate(),
      events: events.filter((event) => {
        return (
          this.day().isSame(event.startDate, 'day') ||
          this.day().isSame(event.endDate, 'day') ||
          (this.day().isAfter(event.startDate, 'day') &&
            this.day().isBefore(event.endDate, 'day'))
        );
      }),
    });

    this.store.setValue(this.day().toDate());
    this.select.emit();
  }

  @HostBinding('class') class = 'flex-1';

  readonly service = inject(CalendarService);

  options = this.store.options;
  events = this.store.events;

  select = output<void>();

  _height = input<number, string | number>(192, {
    alias: 'height',
    transform: numberAttribute,
  });
  $height = signal<number>(192);
  height = computed(() => `${this._height() || this.$height()}px`);

  index = computed<number>(() => this.day().day()); // 요일 index

  selected = computed<boolean>(
    () =>
      dayjs(this.value()).format('YYYY-MM-DD') ===
      this.day().format('YYYY-MM-DD'),
  );

  handleCreate(ev: any) {
    ev.stopPropagation();
    this.service.handleCreate(this.day().toDate());
  }
}
