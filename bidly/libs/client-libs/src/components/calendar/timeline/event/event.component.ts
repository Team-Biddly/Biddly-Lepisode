import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  HostBinding,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { DndDraggableDirective } from 'ngx-drag-drop';
import { injectResize } from 'ngxtension/resize';
import { Subject } from 'rxjs';
import { Menu } from '../../../menu/menu.component';
import { MenuOption } from '../../../menu/option/menu-option.component';
import { CommonEventAdapter } from '../../adapters/event.adapter';
import {
  TIMELINE_CALENDAR_DEFAULT_TOP,
  TimelineSlot,
} from '../../calendar.types';
import { TimelineCalendarEventContent } from './content/event-content.component';

dayjs.extend(isBetween);

@Component({
  selector: 'app-timeline-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  standalone: true,
  imports: [
    CdkMenuModule,
    DndDraggableDirective,
    Menu,
    MenuOption,
    TimelineCalendarEventContent,
    CommonModule,
  ],
})
export class TimelineEvent
  extends CommonEventAdapter
  implements AfterViewChecked, AfterViewInit, OnDestroy
{
  @HostBinding('class') class = 'absolute z-10 px-2';
  @HostBinding('style.top') get getTop() {
    return `${TIMELINE_CALENDAR_DEFAULT_TOP}px`;
  }
  @HostBinding('style.left') get getLeft() {
    return `${this.left()}px`;
  }
  @HostBinding('style.height') get getHeight() {
    if (!this.height()) return 'auto';

    return `${this.height()}px`;
  }
  @HostBinding('style.width') get getWidth() {
    if (!this.width()) return 'auto';

    return `${this.width()}px`;
  }

  private destroy$ = new Subject<void>();
  resize$ = injectResize();

  left = signal(0);
  width = signal(0);
  height = signal(0);
  time = input.required<string>();
  day = input.required<Dayjs>();
  slots = input.required<TimelineSlot[]>();
  order = signal(0);

  ngAfterViewInit(): void {
    this.store.mode$.subscribe({
      next: () => {
        this.calculate();
      },
    });

    this.resize$.subscribe(() => {
      this.calculate();
    });
  }

  ngAfterViewChecked(): void {
    this.calculate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculate() {
    // 이벤트의 height 설정
    this.handleHeight();

    const startDay = dayjs(this.event().startDate).format('DD'); // 이벤트 시작 날짜
    const day = document.querySelector(`.day[data-day='${startDay}']`);
    const dayWidth = day?.clientWidth || 0; // 하루의 너비 (px)
    const daysDifference = Number(startDay);

    let overlap = 1;
    let order = 1;

    const event = this.event();
    const startDate = dayjs(event.startDate);
    const endDate = dayjs(event.endDate);

    const diff = Math.round(
      Number(endDate.format('HH')) - Number(startDate.format('HH')) + 1,
    );
    this.slots()
      .filter((slot) => {
        return slot.day === startDay;
      })
      ?.map((slot) => {
        for (let i = 0; i <= diff; i++) {
          const date = startDate.add(i, 'hour');
          if (slot.time === date.format('HH:00')) {
            if (overlap <= slot.events.length) {
              order = slot.events.indexOf(this.event());
              overlap = slot.events.length;
            }
          }
        }
      });

    this.width.set(overlap > 1 ? dayWidth / overlap : dayWidth);

    const leftPosition = this.getLeftPosition(dayWidth, daysDifference);

    // 이벤트의 순서에 따른 left 값 설정
    const orderLeft = order > 0 ? this.width() * order : 0;

    // left 값 설정
    this.left.set(overlap > 1 ? leftPosition + orderLeft : leftPosition);
  }

  private getLeftPosition(dayWidth: number, daysDifference: number): number {
    // 일별 조회일 경우 130 고정
    if (this.store.mode() === 'day') {
      return 130;
    }

    // 선이 차지하는 너비 계산
    const divider = 1 * (daysDifference - 2);

    // 기본값 + 선이 차지하는 너비 + (오늘 날짜) * 하루의 너비
    return 130 + divider + (daysDifference - 1) * dayWidth;
  }

  private handleHeight(): void {
    const event = this.event();
    const startDate = dayjs(event.startDate);
    const endDate = dayjs(event.endDate);

    const diff = Math.round(
      Number(endDate.format('HH')) - Number(startDate.format('HH')) + 1,
    );

    if (event)
      if (diff > 1) {
        // (블록 높이 x 시간차) - 패딩
        this.height.set(48 * diff - 16);
      }
  }
}
