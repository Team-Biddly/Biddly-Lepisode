import {
  computed,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { OrderPlanService } from '@api-client';
import { PreStandardType } from '@common';
import { filter, pairwise } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderPlanPageStore {
  private readonly router = inject(Router);
  private readonly orderPlanService = inject(OrderPlanService);

  advancedKeywords = signal(false);

  pageNo = signal(1);
  pageSize = signal(10);
  startDate = signal<string | undefined>(undefined);
  endDate = signal<string | undefined>(undefined);
  type = signal<PreStandardType | ''>('');
  query = signal<string>('');
  담당자 = signal<string>('');
  발주기관 = signal<string>('');
  startPrice = signal<string>('');
  endPrice = signal<string>('');
  keywords = signal<string[]>([]);
  andKeywords = signal<string[]>([]);
  orKeywords = signal<string[]>([]);
  notKeywords = signal<string[]>([]);

  searchOptions = linkedSignal(() => ({
    pageNo: this.pageNo(),
    pageSize: this.pageSize(),
    startDate: this.startDate(),
    endDate: this.endDate(),
    담당자: this.담당자(),
    발주기관: this.발주기관(),
    startPrice: this.startPrice(),
    endPrice: this.endPrice(),
    query: this.query(),
    keywords: this.keywords().length > 0 ? this.keywords() : undefined,
    andKeywords: this.andKeywords().length > 0 ? this.andKeywords() : undefined,
    orKeywords: this.orKeywords().length > 0 ? this.orKeywords() : undefined,
    notKeywords: this.notKeywords().length > 0 ? this.notKeywords() : undefined,
    type: this.type() === '' ? undefined : (this.type() as PreStandardType),
  }));

  setOptionCount = computed(() => {
    const keys = Object.keys(this.searchOptions());

    const count = keys.reduce((acc, key) => {
      const value = (this.searchOptions() as any)[key];
      if (
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return Math.max(0, count - 2);
  });

  readonly searchOptions$ = toObservable(this.searchOptions);

  /** 변경 시 페이지 번호를 1로 초기화 할 옵션의 Key */
  pageResetKeys = computed(() =>
    Object.keys(this.searchOptions()).filter(
      (key) => key !== 'pageNo' && key !== 'pageSize',
    ),
  );

  constructor() {
    this.searchOptions$.subscribe((options) => {
      this.router.navigate([], {
        queryParams: options,
        queryParamsHandling: 'merge',
      });
    });

    this.searchOptions$
      .pipe(
        pairwise(),
        filter(([prev, curr]) =>
          this.pageResetKeys().some(
            (key) =>
              (prev as Record<string, any>)[key] !==
              (curr as Record<string, any>)[key],
          ),
        ),
      )
      .subscribe(() => this.pageNo.set(1));

    toObservable(this.advancedKeywords).subscribe((advanced) => {
      if (!advanced) {
        this.andKeywords.set([]);
        this.orKeywords.set([]);
        this.notKeywords.set([]);
      } else {
        this.keywords.set([]);
      }
    });
  }

  setOptions(options: any) {
    if (options.pageNo) {
      this.pageNo.set(+options.pageNo);
    }
    if (options.pageSize) {
      this.pageSize.set(+options.pageSize);
    }
    if (options.startDate) {
      this.startDate.set(options.startDate);
    }
    if (options.endDate) {
      this.endDate.set(options.endDate);
    }
    if (options.담당자) {
      this.담당자.set(options.담당자);
    }
    if (options.startPrice) {
      this.startPrice.set(options.startPrice);
    }
    if (options.endPrice) {
      this.endPrice.set(options.endPrice);
    }
    if (options.type) {
      this.type.set(options.type);
    }
    if (options.query) {
      this.query.set(options.query);
    }
    if (options.발주기관) {
      this.발주기관.set(options.발주기관);
    }

    if (options.keywords) {
      if (Array.isArray(options.keywords)) {
        this.keywords.set(options.keywords);
      } else if (typeof options.keywords === 'string') {
        this.keywords.set(options.keywords.split(','));
      }
    }

    if (options.andKeywords) {
      if (Array.isArray(options.andKeywords)) {
        this.andKeywords.set(options.andKeywords);
      } else if (typeof options.andKeywords === 'string') {
        this.andKeywords.set(options.andKeywords.split(','));
      }
    }
    if (options.orKeywords) {
      if (Array.isArray(options.orKeywords)) {
        this.orKeywords.set(options.orKeywords);
      } else if (typeof options.orKeywords === 'string') {
        this.orKeywords.set(options.orKeywords.split(','));
      }
    }
    if (options.notKeywords) {
      if (Array.isArray(options.notKeywords)) {
        this.notKeywords.set(options.notKeywords);
      } else if (typeof options.notKeywords === 'string') {
        this.notKeywords.set(options.notKeywords.split(','));
      }
    }
  }

  reset() {
    this.pageNo.set(1);
    this.pageSize.set(10);
    this.startDate.set(undefined);
    this.endDate.set(undefined);
    this.담당자.set('');
    this.발주기관.set('');
    this.query.set('');
    this.startPrice.set('');
    this.endPrice.set('');
    this.type.set('');
    this.keywords.set([]);
    this.andKeywords.set([]);
    this.orKeywords.set([]);
    this.notKeywords.set([]);
    this.advancedKeywords.set(false);
  }
}
