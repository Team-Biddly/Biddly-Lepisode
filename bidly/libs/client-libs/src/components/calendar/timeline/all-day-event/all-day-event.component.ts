import { CdkMenuModule } from '@angular/cdk/menu';
import {
  AfterViewChecked,
  Component,
  computed,
  HostBinding,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import dayjs from 'dayjs';
import { DndDraggableDirective } from 'ngx-drag-drop';
import { injectResize } from 'ngxtension/resize';
import { Subject, takeUntil } from 'rxjs';
import { Menu } from '../../../menu/menu.component';
import { MenuOption } from '../../../menu/option/menu-option.component';
import { CommonEventAdapter } from '../../adapters/event.adapter';
import { TIMELINE_CALENDAR_DEFAULT_TOP } from '../../calendar.types';
import { Icon } from '../../../icon/icon.component';
import { CommonModule } from '@angular/common';
import { CalendarRepeatIcon } from '../../etc/repeat-icon/repeat-icon.component';

@Component({
  selector: 'app-all-day-event',
  standalone: true,
  templateUrl: './all-day-event.component.html',
  styleUrls: ['./all-day-event.component.css'],
  imports: [
    DndDraggableDirective,
    Menu,
    MenuOption,
    CdkMenuModule,
    Icon,
    CommonModule,
    CalendarRepeatIcon,
  ],
})
export class AllDayTimelineEvent
  extends CommonEventAdapter
  implements AfterViewChecked, OnDestroy
{
  @HostBinding('class') class = 'absolute z-10 px-2';
  @HostBinding('style.top') get getTop() {
    return `${this.top() || TIMELINE_CALENDAR_DEFAULT_TOP}px`;
  }
  @HostBinding('style.left') get getLeft() {
    return `${this.left()}px`;
  }
  @HostBinding('style.width') get getWidth() {
    return `${this.width()}px`;
  }

  private destroy$ = new Subject<void>();
  resize$ = injectResize();

  top = signal(0);
  left = signal(0);
  width = signal(0);

  // 이번달부터 시작하는 이벤트가 아닐 경우
  isNotStartCurrentMonth = computed(
    () =>
      dayjs(this.event().startDate).format('MM') !==
      dayjs(this.store.value()).format('MM'),
  );

  ngAfterViewChecked(): void {
    // 이벤트의 width 설정
    this.handleWidth();

    // left 값 설정
    this.handleLeft();

    // 이벤트의 top 값 설정
    this.handleTop();

    // resize 이벤트 발생 시 width 재설정
    this.resize$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.handleWidth();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleLeftResize(ev: DragEvent): void {
    this.handleResize(ev, 'startDate');
  }

  handleRightResize(ev: DragEvent): void {
    this.handleResize(ev, 'endDate');
  }

  private handleResize(ev: DragEvent, dateType: 'startDate' | 'endDate'): void {
    if (!this.options()?.event?.resize) return;

    const { offsetX } = ev;
    const index = Math.round(offsetX / 128);
    const event = this.event();
    const currentDate = dayjs(event[dateType]);
    let newDate;

    if (index > 0) {
      newDate = currentDate.add(index, 'day');
    } else {
      newDate = currentDate.subtract(index * -1, 'day');
    }

    if (newDate.format('YYYY-MM') !== currentDate.format('YYYY-MM')) {
      event[dateType] = currentDate.startOf('day').toDate();
    } else {
      event[dateType] = newDate.toDate();
    }
  }

  private handleTop(): void {
    const top = TIMELINE_CALENDAR_DEFAULT_TOP;
    this.top.set(top + this.index() * 32 + this.index() * 8);
  }

  private handleLeft(): void {
    const startDay = dayjs(this.event().startDate).format('DD');

    // 이번달부터 시작하는 이벤트가 아닐 경우
    if (this.isNotStartCurrentMonth()) {
      this.left.set(128);
      return;
    }

    if (this.store.mode() === 'day') {
      this.left.set(128);
      return;
    }

    const day = document.querySelector(`.day[data-day='${startDay}']`);
    const dayWidth = day?.clientWidth || 0; // 하루의 너비 (px)

    // 날짜 차이 계산
    const daysDifference = Number(startDay);

    // left 값 계산
    const leftPosition = 128 + (daysDifference - 1) * dayWidth;

    // left 값 설정
    this.left.set(leftPosition);
  }

  private handleWidth(): void {
    const startDate = dayjs(this.event().startDate);
    const endDate = dayjs(this.event().endDate);
    const width = this.calculateWidth(startDate, endDate);
    this.width.set(width);
  }

  private calculateWidth(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): number {
    const dayEl = document.querySelector(`.day-item`) as HTMLElement | null;
    const dayWidth = dayEl!.clientWidth || 0;

    if (this.store.mode() === 'day') {
      return dayWidth;
    }

    // 이번달부터 시작하는 이벤트가 아닐 경우
    if (this.isNotStartCurrentMonth()) {
      return dayWidth * Number(endDate.format('DD'));
    }

    if (startDate.isSame(endDate, 'day')) {
      return dayWidth;
    }

    const diff = Number(endDate.format('DD')) - Number(startDate.format('DD'));
    return dayWidth * (diff + 1);
  }
}
