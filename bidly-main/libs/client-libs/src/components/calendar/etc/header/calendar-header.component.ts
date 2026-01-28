import { CdkMenuModule, CdkMenuTrigger } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, inject, model, OnInit, viewChild } from '@angular/core';
import dayjs from 'dayjs';
import { toObservableSignal } from 'ngxtension/to-observable-signal';
import { BaseConfig } from '../../../common/config/config.adapter';
import { Icon } from '../../../icon/icon.component';
import { PickCalendar } from '../../../input/date-picker/pick-calendar/pick-calendar.component';
import { TabOption, Tabs } from '../../../tabs/tabs.component';
import { CalendarService } from '../../calendar.service';
import { CalendarStore } from '../../calendar.store';
import { CalendarMode } from '../../calendar.types';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  standalone: true,
  imports: [CommonModule, Tabs, CdkMenuModule, PickCalendar, Icon],
})
export class CalendarHeader extends BaseConfig implements OnInit {
  readonly store = inject(CalendarStore);
  readonly service = inject(CalendarService);

  menuTrigger = viewChild(CdkMenuTrigger);

  modes: TabOption[] = [
    {
      icon: 'material-symbols:calendar-today-outline',
      label: '일',
      value: 'day',
    },
    {
      icon: 'material-symbols:calendar-view-month-outline',
      label: '주',
      value: 'week',
    },
    {
      icon: 'material-symbols:calendar-view-month-outline-sharp',
      label: '월',
      value: 'month',
    },
  ];

  views: TabOption[] = [
    {
      icon: 'majesticons:noteblock',
      label: '캘린더',
      value: 'block',
    },
    {
      icon: 'material-symbols:view-timeline',
      label: '타임라인',
      value: 'timeline',
    },
  ];

  mode = model<CalendarMode>();
  _mode = toObservableSignal(this.store.mode);

  value = this.store.value;

  ngOnInit(): void {
    this._mode.subscribe((mode) => {
      this.mode.set(mode);
    });
  }

  /**
   * @description 년도와 달을 이동하는 통합 함수
   * @param type
   * @param unit
   * @param number
   */
  handleNavigate(
    type: 'prev' | 'next',
    unit: 'year' | 'month' | 'week' | 'day',
    number: number,
  ) {
    if (type === 'prev') {
      const value = dayjs(this.value()).subtract(number, unit).toDate();
      this.store.setValue(value);
    } else {
      const value = dayjs(this.value()).add(number, unit).toDate();
      this.store.setValue(value);
    }
  }
  /**
   * @param ev
   */
  handleDateChange(ev: Date) {
    this.store.setValue(ev);
  }

  /**
   * @description 일,주,월 중 선택한 모드에 따라 스토어에 저장
   * @param mode
   */
  handleModeChange(mode: any) {
    this.store.setMode(mode);
  }

  handleCreate() {
    this.service.handleCreate();
  }
}
