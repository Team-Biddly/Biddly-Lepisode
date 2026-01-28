import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Grid, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

@Directive({
  selector: '[swiper]',
  standalone: true,
})
export class SwiperDirective implements AfterViewInit {
  private readonly swiperElement: HTMLElement;
  private swiper?: Swiper;

  @Output() init: EventEmitter<Swiper> = new EventEmitter<Swiper>();
  @Output() realIndex: EventEmitter<number> = new EventEmitter<number>();
  @Output() timeLeft: EventEmitter<number> = new EventEmitter<number>();

  @Input('options') options?: SwiperOptions;

  constructor(
    private element: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.swiperElement = element.nativeElement;
    this.swiperElement.style.overflow = 'hidden';
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.options) {
      this.swiper = new Swiper(this.swiperElement, {
        modules: [Autoplay, Pagination, Grid],
        ...this.options,
        on: {
          realIndexChange: () => {
            this.realIndex.emit(this.swiper?.realIndex);
          },
          autoplayTimeLeft: () => {
            this.timeLeft.emit(this.swiper?.autoplay?.timeLeft);
          },
        },
      });

      this.init.emit(this.swiper);
    }
  }
}
