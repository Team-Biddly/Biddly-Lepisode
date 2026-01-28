import { computed, inject, Injectable } from '@angular/core';
import { UserStore } from './user.store';
import {
  BidService,
  BookmarkService,
  OrderPlanService,
  PreStandardService,
} from '@api-client';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { BookmarkModelName } from '@prisma/client';

@Injectable({ providedIn: 'root' })
export class BookmarkStore {
  private readonly userStore = inject(UserStore);
  private readonly bookmarkService = inject(BookmarkService);
  private readonly bidService = inject(BidService);
  private readonly preStandardService = inject(PreStandardService);
  private readonly orderPlanService = inject(OrderPlanService);

  $bookmarks = rxResource({
    params: () => this.userStore.user()?.id,
    stream: ({ params }) =>
      params ? this.bookmarkService.bookmarkControllerFindMy() : of([]),
  });

  bookmarkedBids = rxResource({
    params: () => this.userStore.user()?.id,
    stream: ({ params }) =>
      params
        ? this.bidService.bidControllerGetBookmarked({ pageNo: 1, pageSize: 4 })
        : of({
            items: [],
            pageInfo: {
              totalItems: 0,
              pageItems: 0,
              totalPages: 0,
              pageNo: 0,
              pageSize: 0,
            },
          }),
  });

  bookmarkedPreStandards = rxResource({
    params: () => this.userStore.user()?.id,
    stream: ({ params }) =>
      params
        ? this.preStandardService.preStandardControllerGetBookmarked({
            pageNo: 1,
            pageSize: 4,
          })
        : of({
            items: [],
            pageInfo: {
              totalItems: 0,
              pageItems: 0,
              totalPages: 0,
              pageNo: 0,
              pageSize: 0,
            },
          }),
  });

  bookmarkedOrderPlans = rxResource({
    params: () => this.userStore.user()?.id,
    stream: ({ params }) =>
      params
        ? this.orderPlanService.orderPlanControllerGetBookmarked({
            pageNo: 1,
            pageSize: 4,
          })
        : of({
            items: [],
            pageInfo: {
              totalItems: 0,
              pageItems: 0,
              totalPages: 0,
              pageNo: 0,
              pageSize: 0,
            },
          }),
  });

  stat = computed(() => {
    const bookmarks = this.$bookmarks.value() || [];

    return {
      발주계획: bookmarks.filter((b) => b.modelName === '발주계획').length,
      사전규격: bookmarks.filter((b) => b.modelName === '사전규격').length,
      입찰공고: bookmarks.filter((b) => b.modelName === '입찰공고').length,
    };
  });

  isBookmarked(modelId: string, modelName: BookmarkModelName) {
    return this.$bookmarks
      .value()
      ?.some((b) => b.modelName === modelName && b.modelId === modelId);
  }

  refresh() {
    this.$bookmarks.reload();
  }
}
