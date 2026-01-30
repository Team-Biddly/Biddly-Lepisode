import {
  AfterViewChecked,
  Component,
  computed,
  HostBinding,
  input,
  OnInit,
  signal,
} from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { CommonEventAdapter } from '../../adapters/event.adapter';
import {
  BLOCK_CALENDAR_DEFAULT_TOP,
  BLOCK_CALENDAR_GAP,
} from '../../calendar.types';

dayjs.extend(isBetween);

/**
 * @export CalendarEventAdapter
 * @description 이벤트의 전체 로직을 담당한다.
 */
@Component({
  selector: 'app-event-adapter',
  standalone: true,
  template: ``,
})
export class CalendarEventAdapter
  extends CommonEventAdapter
  implements OnInit, AfterViewChecked
{
  @HostBinding('class') class = 'absolute z-50';
  @HostBinding('style.top') get _top() {
    return `${this.top()}px`;
  }
  @HostBinding('style.left') get _left() {
    return `${this.left()}px`;
  }

  customTheme: 'basic' | 'colorful' = 'basic';

  days = input.required<Dayjs[]>();
  width = input.required<number>();
  weekIndex = input.required<number>();

  currentSlot = signal(0);

  top = signal(0);
  left = computed(() =>
    this.startHasPrevWeek() ? 0 : this.daysInStartDate() * this.width(),
  );

  // 이벤트의 width를 계산
  eventWidth = computed(() => {
    if (this.bothHas()) {
      return 100 * this.width();
    }

    if (this.daysInStartDate() !== -1) {
      const diff = dayjs(this.event().endDate).diff(
        this.event().startDate,
        'day',
      );

      return (diff + 1) * this.width();
    } else {
      return (this.daysInEndDate() + 1) * this.width();
    }
  });

  // 이벤트 시작일이 몇 번째 날짜인지
  daysInStartDate = computed(() =>
    this.days().findIndex((day) => day.isSame(this.event().startDate, 'day')),
  );

  // 이벤트 종료일이 몇 번째 날짜인지
  daysInEndDate = computed(() =>
    this.days().findIndex((day) => day.isSame(this.event().endDate, 'day')),
  );

  // 이벤트가 시작일이 저번 주에 포함되어 있는지
  startHasPrevWeek = computed(() => this.daysInStartDate() === -1);

  // 현재 주에 시작일/종료일 둘다 포함되어 있지 않을 때
  // 이벤트가 현재 주에 포함되어 있는지
  bothHas = computed(() => {
    if (this.startHasPrevWeek() && this.daysInEndDate() === -1) {
      return this.days().some((day) =>
        day.isBetween(
          this.event().startDate,
          this.event().endDate,
          'day',
          '[]',
        ),
      );
    }
    return false;
  });

  ngOnInit(): void {
    if (!this.event()?.startDate || !this.event()?.endDate) {
      throw new Error(
        'Invalid CalendarEvent: startDate or endDate is missing.',
      );
    }
  }

  ngAfterViewChecked() {
    this.updateTopPosition();
  }

  private updateTopPosition() {
    // 현재 주에 해당하는 이벤트 DOM 요소 가져오기
    const refs = Array.from(
      document.querySelectorAll(
        `.calendar-event[data-week-index="${this.weekIndex()}"]`,
      ),
    );

    // 슬롯 배열: 각 슬롯은 이벤트가 차지하는 날짜 범위를 저장
    const slots: { start: Dayjs; end: Dayjs }[][] = [];

    refs.map((ref, index) => {
      const height = ref.clientHeight;
      const start = dayjs(ref.getAttribute('data-start'));
      const end = dayjs(ref.getAttribute('data-end'));

      if (index === this.index()) {
        // 현재 이벤트의 위치를 계산하고 `top` 설정
        const slotIndex = this.calculateSlotNew(start, end, slots);

        // DOM에 슬롯 정보 저장
        ref.setAttribute('data-slot', slotIndex.toString());
        this.currentSlot.set(slotIndex); // 현재 슬롯 설정
        this.top.set(
          slotIndex
            ? BLOCK_CALENDAR_DEFAULT_TOP +
                height * slotIndex +
                BLOCK_CALENDAR_GAP * slotIndex
            : BLOCK_CALENDAR_DEFAULT_TOP,
        ); // `top` 값 설정
        return;
      }

      // 이미 배치된 이벤트 정보를 슬롯 배열에 추가
      const refSlotIndex = parseInt(ref.getAttribute('data-slot') || '0', 10);
      slots[refSlotIndex] = slots[refSlotIndex] || [];
      slots[refSlotIndex].push({ start, end });
    });
  }

  /**
   * @description 새로운 이벤트가 들어갈 슬롯과 `top` 값을 계산합니다.
   * @param start 현재 이벤트의 시작 날짜
   * @param end 현재 이벤트의 끝나는 날짜
   * @param slots 현재 슬롯 배열 (슬롯별 이벤트들의 시작/종료일 저장)
   * @returns { slotIndex: number }
   */
  private calculateSlotNew(
    start: Dayjs,
    end: Dayjs,
    slots: { start: Dayjs; end: Dayjs }[][],
  ): number {
    let slotIndex = 0;

    // 이벤트가 들어갈 수 있는 첫 번째 빈 슬롯 찾기
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];

      // 슬롯 내 이벤트와 겹치는지 확인
      const isOverlapping = slot.some((event) =>
        this.isOverlapping(start, end, event.start, event.end),
      );

      if (!isOverlapping) {
        slotIndex = i; // 비어있는 슬롯 발견
        break;
      }

      slotIndex = i + 1; // 모든 슬롯이 꽉 차면 다음 슬롯으로 이동
    }

    // 새로운 슬롯이 필요하면 추가
    slots[slotIndex] = slots[slotIndex] || [];
    slots[slotIndex].push({ start, end });

    return slotIndex;
  }

  /**
   * @description 이벤트 날짜가 겹치는지 확인
   * @param ref
   * @returns
   */
  protected isOverlapping(
    start: Dayjs,
    end: Dayjs,
    eventStartDate: Dayjs,
    eventEndDate: Dayjs,
  ): boolean {
    return (
      this.isDateBetween(start, eventStartDate, eventEndDate) ||
      this.isDateBetween(end, eventStartDate, eventEndDate) ||
      this.isDateBetween(eventStartDate, start, end) ||
      this.isDateBetween(eventEndDate, start, end)
    );
  }

  /**
   * @description 날짜가 start와 end 사이에 있는지 확인
   * @param date
   * @param start
   * @param end
   * @returns
   */
  protected isDateBetween(date: Dayjs, start: Dayjs, end: Dayjs): boolean {
    return date.isBetween(start, end, 'day', '[]');
  }
}
