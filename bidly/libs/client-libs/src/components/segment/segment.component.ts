import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  Type,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  viewChild,
  viewChildren,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Color, Rounded, Size, Variant } from '../common/types';
import { SegmentOptionComponent } from './option/segment-option.component';

export type SegmentOption = {
  label: string;
  value: string;
  icon?: string;
  count?: number;
  height?: Size;
  renderItem?: Type<unknown>;
  badge?: {
    label: string;
    color: Color;
    size: Size;
    rounded: Rounded;
    variant: Variant;
  };
};

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.css'],
  standalone: true,
  imports: [CommonModule, SegmentOptionComponent],
})
export class Segment
  implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy
{
  @HostBinding('class') get hostClass() {
    if (this.scrollEnabled()) {
      return 'w-full';
    }

    return '';
  }

  readonly elementRef = inject(ElementRef);

  container = viewChild<ElementRef<HTMLElement>>('container');
  indicator = viewChild<ElementRef<HTMLElement>>('indicator');
  items = viewChildren<SegmentOptionComponent>('item');

  color = input<Color>('primary');
  options = input<string[] | SegmentOption[]>([]);

  optionsList = computed<SegmentOption[]>(() => {
    if (this.options().length === 0) return [];

    return this.options().map((option) => {
      if (typeof option === 'string') {
        return {
          label: option,
          value: option,
        };
      }

      return option;
    });
  });

  value = model<string>(this.optionsList()[0]?.value);
  value$ = toObservable(this.value);

  scrollEnabled = input<boolean, string>(false, {
    transform: booleanAttribute,
  });

  private scrollListener?: () => void;

  ngOnInit(): void {
    if (!this.value()) {
      this.value.set(this.optionsList()[0].value);
    }
  }

  ngAfterViewInit(): void {
    this.value$.subscribe({
      next: (value) => {
        if (this.container() && value && this.scrollEnabled()) {
          // setTimeout 안걸면 scrollBy가 안먹힘
          setTimeout(() => {
            const left = this.getTranslateX(
              this.optionsList().findIndex((item) => item.value === value),
            );
            const containerElement = this.container()?.nativeElement;
            if (containerElement) {
              containerElement.scrollBy({
                left,
              });
            }
          }, 100);
        }
      },
    });

    // 스크롤 이벤트 리스너 추가
    if (this.scrollEnabled() && this.container()) {
      const containerElement = this.container()?.nativeElement;
      if (containerElement) {
        this.scrollListener = () => {
          this.transform();
        };
        containerElement.addEventListener('scroll', this.scrollListener);
      }
    }
  }

  ngOnDestroy(): void {
    // 스크롤 이벤트 리스너 정리
    if (this.scrollListener && this.container()) {
      const containerElement = this.container()?.nativeElement;
      if (containerElement) {
        containerElement.removeEventListener('scroll', this.scrollListener);
      }
    }
  }

  ngAfterViewChecked(): void {
    this.value$.subscribe((value) => {
      if (this.items() && this.indicator() && value) {
        this.transform();
      }
    });
  }

  handleClick(option: SegmentOption) {
    this.value.set(option.value);
  }

  transform() {
    const index = this.optionsList().findIndex(
      (item) => item.value === this.value(),
    );
    if (index === -1) return;

    const activeItem = this.items()[index];
    if (!activeItem) return;

    const activeElement = activeItem.elementRef.nativeElement;
    const containerElement = this.container()?.nativeElement;
    const indicatorElement = this.indicator()?.nativeElement;

    if (!activeElement || !containerElement || !indicatorElement) return;

    // 활성 아이템의 너비 설정
    indicatorElement.style.width = `${activeElement.offsetWidth}px`;

    // 컨테이너와 활성 아이템의 실제 위치를 기반으로 계산
    const containerRect = containerElement.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();

    let translateX = activeRect.left - containerRect.left;

    // 스크롤이 활성화된 경우 컨테이너의 스크롤 위치를 추가로 고려
    if (this.scrollEnabled()) {
      translateX += containerElement.scrollLeft;
    }

    indicatorElement.style.transform = `translateX(${translateX}px)`;
  }

  getTranslateX(index: number) {
    const containerElement = this.container()?.nativeElement;
    if (!containerElement) return 0;

    // 컨테이너의 gap 값을 동적으로 가져오기
    const computedStyle = window.getComputedStyle(containerElement);
    const gapValue = parseFloat(computedStyle.gap) || 4; // 기본값 4px

    const widthSum = this.items()
      .slice(0, index)
      .reduce((acc, cur) => acc + cur.elementRef.nativeElement.offsetWidth, 0);

    // gap은 아이템 사이에만 있으므로 index만큼 곱함
    return widthSum + gapValue * index;
  }
}
