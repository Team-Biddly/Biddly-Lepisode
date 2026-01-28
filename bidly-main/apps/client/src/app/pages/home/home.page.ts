import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  BannerService,
  BidService,
  FaqService,
  OrderPlanService,
  PreStandardService,
} from '@api-client';
import { Align, Icon, SwiperDirective } from '@client-libs';
import { Mode } from '@common';
import { map } from 'rxjs';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { BookmarkStore } from '../../../stores/bookmark.store';
import { UserStore } from '../../../stores/user.store';
import { BidItemComponent } from '../bid/bid-item/bid-item.component';
import { OrderPlanItemComponent } from '../order-plan/order-plan-item/order-plan-item.component';
import { PreStandardItemComponent } from '../pre-standard/pre-standard-item/pre-standard-item.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    Icon,
    RouterLink,
    OrderPlanItemComponent,
    PreStandardItemComponent,
    BidItemComponent,
    SwiperDirective,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class HomePage implements OnInit {
  private readonly bannerService = inject(BannerService);
  private readonly bidService = inject(BidService);
  private readonly preStandardService = inject(PreStandardService);
  private readonly orderPlanService = inject(OrderPlanService);
  private readonly faqService = inject(FaqService);
  protected readonly userStore = inject(UserStore);

  protected readonly bookmarkStore = inject(BookmarkStore);
  user = this.userStore.$user;

  swiper?: Swiper;
  swiperOption: WritableSignal<SwiperOptions> = signal<SwiperOptions>({
    slidesPerView: 1,
    allowTouchMove: true,
    resistanceRatio: 0.85,
    speed: 800, // 전환 속도
    loop: true, // 무한 루프
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    autoHeight: false,
    effect: 'slide',
    watchOverflow: true,
  });

  currentTab: 'order-plan' | 'pre-standard' | 'bid' = 'order-plan';

  currentBannerIndex = signal(0);
  banners = signal<
    { imageUrl?: string; mobileImageUrl?: string; targetUrl?: string }[]
  >([]);
  mode = signal<string>(Mode.PC);
  isMobile() {
    if (window.innerWidth <= 640) {
      this.mode.set(Mode.MOBILE);
      return true;
    }
    return false;
  }

  $faqResult = rxResource({
    stream: () =>
      this.faqService.faqControllerSearchV1({
        pageNo: 1,
        pageSize: 5,
        orderBy: 'createdAt',
        align: 'desc' as Align,
        query: '',
      }),
  });

  bids = toSignal(
    this.bidService
      .bidControllerSearch({ pageNo: 1, pageSize: 10 })
      .pipe(map((res) => res.items)),
  );

  preStandards = toSignal(
    this.preStandardService
      .preStandardControllerSearch({ pageNo: 1, pageSize: 10 })
      .pipe(map((res) => res.items)),
  );

  orderPlans = toSignal(
    this.orderPlanService
      .orderPlanControllerSearch({ pageNo: 1, pageSize: 10 })
      .pipe(map((res) => res.items)),
  );

  currentFaqIndex = signal(0);

  faqs = computed(() => this.$faqResult.value()?.items || []);
  currentFaq = computed(() => this.faqs()[this.currentFaqIndex()]);

  // 이전 FAQ
  prev() {
    if (this.currentFaqIndex() > 0) {
      this.currentFaqIndex.set(this.currentFaqIndex() - 1);
    }
  }

  // 다음 FAQ
  next() {
    if (this.currentFaqIndex() < this.faqs().length - 1) {
      this.currentFaqIndex.set(this.currentFaqIndex() + 1);
    }
  }

  ngOnInit() {
    const isMobile = this.isMobile();
    const params = {
      query: '',
      startCreatedAt: undefined,
      endCreatedAt: undefined,
      pageSize: 10,
      pageNo: 1,
      mode: isMobile ? Mode.MOBILE : Mode.PC,
    };

    this.bannerService.bannerControllerSearch(params).subscribe({
      next: (res) => {
        const bannersData = res.items
          .filter((item) => item.isExposed)
          .filter((item) =>
            isMobile ? !!item.mobileImage?.url : !!item.pcImage?.url,
          )
          .map((item) => ({
            imageUrl: item.pcImage?.url || '',
            mobileImageUrl: item.mobileImage?.url || '',
            targetUrl: item.url,
          }));

        this.banners.set(bannersData);

        setInterval(() => {
          if (this.swiper && this.banners().length > 0) {
            this.swiper.slideNext();
          }
        }, 5000);
      },
    });
  }

  goToSlide(index: number) {
    if (this.swiper) {
      this.swiper.slideToLoop(index);
    }
  }

  onSlideChange(realIndex: number) {
    this.currentBannerIndex.set(realIndex);
  }
}
