import {
  Component,
  computed,
  effect,
  HostBinding,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { BaseConfig } from '../../common/config/config.adapter';
import { CalendarHelper } from '../calendar.helper';
import { CalendarStore } from '../calendar.store';
import {
  CalendarEvent,
  CalendarEventMenu,
  eventMenus,
} from '../calendar.types';

@Component({
  selector: 'app-common-event-adapter',
  template: '',
  standalone: true,
})
export class CommonEventAdapter extends BaseConfig {
  @HostListener('click') onClick() {
    if (this.options()?.event?.selected) {
      this.store.eventClickEvent(this.event());
    }
  }

  @HostBinding('class') get hostClass() {
    if (this.options()?.event?.selected) {
      return 'cursor-pointer';
    }

    return '';
  }

  readonly store = inject(CalendarStore);
  options = this.store.options;

  event = input.required<CalendarEvent>();
  index = input.required<number>();

  isContextOpen = signal<boolean>(false);

  /**
   * @description 이벤트의 색상이 Hex 코드인지 확인
   */
  isHex = computed<boolean>(
    () => CalendarHelper.isHexColor(this.currentColor() || '#000000') || false,
  );

  currentColor = computed(() => {
    if (this.event()?.allDay) {
      return this.event()?.color;
    }

    return CalendarHelper.convertToShade(this.event()?.color || '#000000');
  });

  menu = output<CalendarEventMenu>();
  menus = computed(() => {
    let array = eventMenus;

    if (!this.options()?.event?.delete) {
      array = array.filter((menu) => menu.value !== 'delete');
    }

    if (!this.options()?.event?.update) {
      array = array.filter((menu) => menu.value !== 'edit');
    }

    if (!this.options()?.event?.copy) {
      array = array.filter((menu) => menu.value !== 'copy');
    }

    return array;
  });
}
