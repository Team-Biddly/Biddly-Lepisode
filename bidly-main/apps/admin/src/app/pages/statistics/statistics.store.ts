/* eslint-disable @nx/enforce-module-boundaries */
import { computed, effect, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { VisitorService } from '@api-client';
import { BaseStore } from '@client-libs';
import { VisitorControllerGetVisitors$Params } from 'libs/api-client/src/lib/fn/visitor/visitor-controller-get-visitors';
import { of } from 'rxjs';

type State = {
  searchOption: VisitorControllerGetVisitors$Params | null;
  startAt?: Date;
  endAt?: Date;
  type?: string;
};

@Injectable({ providedIn: 'any' })
export class StatisticsStore extends BaseStore<State> {
  private readonly visitorService = inject(VisitorService);

  private $items = rxResource({
    stream: () => {
      const option = this.searchOption();
      if (!option?.pageNo || !option?.pageSize) {
        return of(null);
      }
      return this.visitorService.visitorControllerGetVisitors({
        pageNo: option.pageNo,
        pageSize: option.pageSize,
        align: option.align,
        orderBy: option.orderBy,
        query: option.query,
        startAt: this.startAt()?.toString(),
        endAt: this.endAt()?.toString(),
        type: this.type(),
      });
    },
  });
  items = computed(() => this.$items.value()?.items);
  pageInfo = computed(() => this.$items.value()?.pageInfo);
  searchOption = computed(() => this.state()?.searchOption);

  startAt = computed(() => this.state()?.startAt);
  endAt = computed(() => this.state()?.endAt);
  type = computed(() => this.state()?.type);

  constructor() {
    super({
      searchOption: null,
    });
  }

  /**
   * 검색 옵션을 설정합니다.
   * @param searchOption
   */
  setSearchOption(searchOption: VisitorControllerGetVisitors$Params) {
    this.updateState({
      searchOption,
    });
  }

  /**
   * 날짜 옵션을 설정합니다.
   * @param startAt
   * @param endAt
   * @param type
   */
  setDateOption(startAt: Date, endAt: Date) {
    this.updateState({
      startAt,
      endAt,
    });
  }

  setType(type: string) {
    this.updateState({
      type,
    });
  }

  /**
   * 필터링을 초기화 합니다.
   */
  reset() {
    this.updateState({
      startAt: undefined,
      endAt: undefined,
      type: undefined,
    });
  }

  /**
   * 데이터를 다시 불러옵니다.
   */
  reload() {
    this.$items.reload();
  }
}
