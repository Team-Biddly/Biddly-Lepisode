import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  HostListener,
  input,
  output,
} from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  selector: 'app-day',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './day.component.html',
  styleUrls: ['../pick-calendar.component.css'],
})
export class Day {
  @HostListener('click') click() {
    this.select.emit();
  }

  backgroundColor = computed<string>(() => {
    if (this.isToday()) {
      return 'today';
    }

    if (this.selected()) {
      return 'selected';
    }

    return 'default';
  });

  textColor = computed<string>(() => {
    if (dayjs(this.value()).get('month') !== this.day().get('month')) {
      return 'prev-month';
    }

    if (this.isToday()) {
      return 'today';
    }

    if (this.selected()) {
      return 'selected';
    }

    if (this.day().get('day') === 0) {
      return 'sunday';
    }

    if (this.day().get('day') === 6) {
      return 'saturday';
    }

    return 'default';
  });

  select = output<void>();

  value = input.required<Date>();
  day = input.required<Dayjs>();

  isToday = computed<boolean>(
    () => dayjs().format('YYYY-MM-DD') === this.day().format('YYYY-MM-DD'),
  );
  selected = computed<boolean>(
    () =>
      !this.isToday() &&
      dayjs(this.value()).format('YYYY-MM-DD') ===
        this.day().format('YYYY-MM-DD'),
  );
}
