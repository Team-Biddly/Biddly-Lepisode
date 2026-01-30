import { DecimalPipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  model,
  OnInit,
  output,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { Align } from '../../../common/types';
import { DataGridAdapter } from '../../data-grid.adapter';
import { DataGridStore } from '../../data-grid.store';
import { GridHeader } from '../../header/grid-header.component';
import { DataGridSearchOptions } from '../../types/pagination.type';
import { GridGallery } from '../../view/gallery/gallery.component';
import { GridTable } from '../../view/table/table.component';
import { toObservableSignal } from 'ngxtension/to-observable-signal';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../pagination/pagination.component';

@Component({
  host: {
    ngSkipHydration: 'true',
  },
  selector: 'app-ssp-data-grid',
  templateUrl: './ssp-data-grid.component.html',
  styleUrls: ['./ssp-data-grid.component.css'],
  standalone: true,
  imports: [
    GridTable,
    GridGallery,
    GridHeader,
    DecimalPipe,
    FormsModule,
    Pagination,
  ],
  providers: [DataGridStore],
})
export class ServerSidePaginationDataGrid
  extends DataGridAdapter
  implements OnInit
{
  readonly router = inject(Router);
  readonly _page = injectQueryParams('page');
  readonly _pageSize = injectQueryParams('pageSize');
  readonly _query = injectQueryParams('query');
  readonly _align = injectQueryParams('align');
  readonly _orderBy = injectQueryParams('orderBy');

  refresh = output<DataGridSearchOptions>();

  page = model<number>(1);
  pageSize = model<number>(10);
  query = model<string>('');
  query$ = toObservable(this.query);
  align = model<Align>('desc');
  orderBy = model<string>('createdAt');

  groupBy = this.store.groupBy;

  totalItems = computed(() => {
    if (this.pageInfo()?.totalItems) {
      return this.pageInfo()?.totalItems;
    }

    return this.rowData()?.length || 0;
  });

  navigationEnd$ = injectNavigationEnd();
  handleQueryParams = computed(() => this.options()?.handleQueryParams);
  searchOptions = toObservableSignal(
    computed(() => ({
      pageNo: this.page(),
      pageSize: this.pageSize(),
      query: this.query(),
      align: this.align(),
      orderBy: this.orderBy(),
    })),
  );

  constructor() {
    super();

    // searchOptions 가 변경되면 refresh 이벤트를 발생시킵니다.
    effect(() => {
      this.refresh.emit({
        pageNo: this.page() || 0,
        pageSize: this.pageSize() || 10,
        query: this.query() || '',
        align: this.align() || 'desc',
        orderBy: this.orderBy() || 'createdAt',
      });

      if (this.handleQueryParams()) {
        // 쿼리 파라미터를 변경합니다.
        this.router.navigate([], {
          queryParams: {
            page: this.page(),
            pageSize: this.pageSize(),
            query: this.query(),
            align: this.align(),
            orderBy: this.orderBy(),
          },
          replaceUrl: true,
        });
      }
    });

    /**
     * 페이지 이동 시 쿼리 파라미터를 읽어와서 상태를 설정합니다.
     */
    this.navigationEnd$.subscribe({
      next: () => {
        this.handleQueryParamsChange();
      },
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.handleQueryParamsChange();

    // 데이터가 변경되면 체크박스로 선택된 데이터를 업데이트합니다.
    this.rowData$.subscribe((rowData) => {
      if (this.selecteds() && this.selecteds().length > 0) {
        this.selecteds.set(
          this.selecteds().map((selected) => {
            if (selected && selected['id']) {
              return rowData?.find((row) => row['id'] === selected['id']);
            }

            return selected;
          }),
        );
      }
    });

    // 검색 옵션이 변경되면 선택된 데이터를 초기화합니다.
    this.searchOptions.subscribe({
      next: () => {
        this.selecteds.set([]);
      },
    });
  }

  /**
   * 쿼리 파라미터를 읽어와서 상태를 설정합니다.
   */
  handleQueryParamsChange() {
    if (this.handleQueryParams()) {
      this.page.set(Number(this._page()) || 1);
      this.pageSize.set(
        Number(this._pageSize()) ||
          Number(this.options()?.searchOption?.pageSize) ||
          10,
      );
      this.query.set(this._query() || '');
      this.align.set((this._align() as Align) || 'desc');
      this.orderBy.set(this._orderBy() || 'createdAt');

      // 쿼리가 변경되면 페이지를 1로 설정합니다.
      this.query$.subscribe({
        next: (query) => {
          if (query) {
            this.page.set(1);
          }
        },
      });
    }
  }
}
