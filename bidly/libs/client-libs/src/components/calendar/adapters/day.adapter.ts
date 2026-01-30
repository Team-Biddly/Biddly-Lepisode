import {
  Component,
  computed,
  HostBinding,
  HostListener,
  inject,
  input,
} from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarStore } from '../calendar.store';
import { BaseConfig } from '../../common/config/config.adapter';

@Component({
  selector: 'app-day-adapter',
  template: '',
  standalone: true,
})
export class DayAdapter extends BaseConfig {
  readonly store = inject(CalendarStore);
  day = input.required<Dayjs>();
  value = this.store.value;

  isToday = computed<boolean>(
    () => dayjs().format('YYYY-MM-DD') === this.day().format('YYYY-MM-DD'),
  );
  type = computed<string>(() => {
    if (dayjs(this.value()).get('month') !== this.day().get('month')) {
      return 'prev-month';
    }

    if (this.isToday()) {
      return 'today';
    }

    return 'default';
  });
}
