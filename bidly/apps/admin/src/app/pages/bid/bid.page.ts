import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BidService, BidViewDto } from '@api-client';
import {
  Align,
  ColumnDefinition,
  GridOptions,
  Segment,
  ServerSidePaginationDataGrid,
} from '@client-libs';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
@Component({
  selector: 'app-bid',
  imports: [CommonModule, Segment, ServerSidePaginationDataGrid],
  templateUrl: './bid.page.html',
  styleUrl: './bid.page.css',
})
export default class BidPage {
  private readonly bidService = inject(BidService);
  private readonly router = inject(Router);

  page = linkedQueryParam('pageNo', {
    parse: (v) => (v ? parseInt(v, 10) : 1),
  });
  pageSize = linkedQueryParam('pageSize', {
    parse: (v) => (v ? parseInt(v, 10) : 10),
  });
  query = linkedQueryParam('query', {
    defaultValue: '',
  });
  orderBy = linkedQueryParam('orderBy', {
    defaultValue: 'createdAt',
  });
  align = linkedQueryParam<Align>('align', {
    defaultValue: 'desc',
  });
  type = linkedQueryParam<
    'foreign' | 'construction' | 'thing' | 'service' | undefined
  >('type', {
    defaultValue: undefined,
  });

  columns: ColumnDefinition[] = [
    { field: '업무구분명', name: '업무구분명', type: 'text' },
    { field: '입찰공고명', name: '입찰공고명', type: 'text' },
    {
      field: '입찰개시일시',
      name: '입찰개시일시',
      type: 'date',
    },
    { field: '배정예산금액', name: '배정예산금액', type: 'number' },
    { field: 'keywords', name: '키워드', type: 'text' },
    { field: '등록일시', name: '등록일시', type: 'date' },
  ];

  gridOptions: GridOptions = {
    view: 'table',
    row: {
      clickHandler: (row: BidViewDto) => {
        this.router.navigate(['/bid', row.id]);
      },
    },
  };

  bids$ = rxResource({
    params: () => ({
      pageNo: this.page(),
      pageSize: this.pageSize(),
      query: this.query(),
      orderBy: this.orderBy(),
      align: this.align(),
      type: this.type(),
    }),
    stream: ({ params }) => this.bidService.bidControllerSearch(params),
  });

  constructor() {
    effect(() => {
      this.type();
      this.page.set(1);
    });
  }
}
