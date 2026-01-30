import {
  computed,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { debounceTime, filter, pairwise } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BidPageStore {
  private readonly router = inject(Router);

  advancedKeywords = signal(false);

  pageNo = signal(1);
  pageSize = signal(10);
  startDate = signal<string | undefined>(undefined);
  endDate = signal<string | undefined>(undefined);
  type = signal<'service' | 'thing' | 'construction' | 'foreign' | ''>('');
  query = signal<string>('');
  담당자 = signal<string>('');
  공고기관 = signal<string>('');
  수요기관 = signal<string>('');
  공고종류명 = signal<string>('');
  모의공고여부 = signal<boolean>(false);
  마감공고포함 = signal<boolean>(false);
  입찰개시일시시작 = signal<string>(dayjs().format('YYYY-MM-DD'));
  입찰개시일시종료 = signal<string>('');
  budgetStartPrice = signal<string>('');
  budgetEndPrice = signal<string>('');
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
    공고기관: this.공고기관(),
    수요기관: this.수요기관(),
    공고종류명: this.공고종류명(),
    모의공고여부: this.모의공고여부(),
    마감공고포함: this.마감공고포함(),
    입찰개시일시시작: this.입찰개시일시시작(),
    입찰개시일시종료: this.입찰개시일시종료(),
    budgetStartPrice: this.budgetStartPrice(),
    budgetEndPrice: this.budgetEndPrice(),
    query: this.query(),
    keywords: this.keywords().length > 0 ? this.keywords() : undefined,
    andKeywords: this.andKeywords().length > 0 ? this.andKeywords() : undefined,
    orKeywords: this.orKeywords().length > 0 ? this.orKeywords() : undefined,
    notKeywords: this.notKeywords().length > 0 ? this.notKeywords() : undefined,
    type:
      this.type() === ''
        ? undefined
        : (this.type() as 'service' | 'thing' | 'construction' | 'foreign'),
  }));

  /** 변경 시 페이지 번호를 1로 초기화 할 옵션의 Key */
  pageResetKeys = computed(() =>
    Object.keys(this.searchOptions()).filter(
      (key) => key !== 'pageNo' && key !== 'pageSize',
    ),
  );

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

  constructor() {
    this.searchOptions$.pipe(debounceTime(300)).subscribe((options) => {
      // if (document.activeElement instanceof HTMLInputElement) {
      //   document.activeElement.blur();
      // }
      this.router.navigate([], {
        queryParams: options,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

    this.searchOptions$
      .pipe(
        pairwise(),
        filter(([prev, curr]) => {
          const changedKey = this.pageResetKeys().find(
            (key) =>
              (prev as Record<string, any>)[key] !==
              (curr as Record<string, any>)[key],
          );
          return !!changedKey;
        }),
      )
      .subscribe(() => {
        this.pageNo.set(1);
      });

    /** 키워드 고급검색 여부 변경시 키워드 초기화 */
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
    if (options.budgetStartPrice) {
      this.budgetStartPrice.set(options.budgetStartPrice);
    }
    if (options.budgetEndPrice) {
      this.budgetEndPrice.set(options.budgetEndPrice);
    }
    if (options.type) {
      this.type.set(options.type);
    }
    if (options.query) {
      this.query.set(options.query);
    }
    if (options.발주기관) {
      this.수요기관.set(options.발주기관);
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

    if (options.마감공고포함) {
      if (Array.isArray(options.마감공고포함)) {
        this.마감공고포함.set(options.마감공고포함);
      } else if (typeof options.마감공고포함 === 'string') {
        this.마감공고포함.set(options.마감공고포함 === 'true' ? true : false);
      }
    }
  }

  reset() {
    this.pageNo.set(1);
    this.pageSize.set(10);
    this.startDate.set(undefined);
    this.endDate.set(undefined);
    this.입찰개시일시시작.set(dayjs().format('YYYY-MM-DD'));
    this.입찰개시일시종료.set('');
    this.담당자.set('');
    this.수요기관.set('');
    this.query.set('');
    this.budgetStartPrice.set('');
    this.budgetEndPrice.set('');
    this.type.set('');
    this.keywords.set([]);
    this.andKeywords.set([]);
    this.orKeywords.set([]);
    this.notKeywords.set([]);
    this.advancedKeywords.set(false);
    this.공고기관.set('');
    this.공고종류명.set('');
    this.모의공고여부.set(false);
    this.마감공고포함.set(false);
  }
}
