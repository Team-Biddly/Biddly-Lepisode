import { Component, inject, linkedSignal, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Align,
  ColumnDefinition,
  GridOptions,
  Segment,
  SegmentOption,
  ServerSidePaginationDataGrid,
} from '@client-libs';
import { BidCategory } from '@common';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { PreStandardService } from '@api-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-standard',
  imports: [CommonModule, Segment, ServerSidePaginationDataGrid],
  templateUrl: './pre-standard.page.html',
  styleUrl: './pre-standard.page.css',
})
export default class PreStandardPage {
  private readonly prestandardService = inject(PreStandardService);
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
    '일반용역' | '기술용역' | '물품' | '공사' | '외자' | undefined
  >('type', {
    defaultValue: undefined,
  });

  prestandards$ = rxResource({
    params: () => ({
      pageNo: this.page(),
      pageSize: this.pageSize(),
      query: this.query(),
      orderBy: this.orderBy(),
      align: this.align(),
      type: this.type(),
    }),
    stream: ({ params }) =>
      this.prestandardService.preStandardControllerSearch(params),
  });

  columns: ColumnDefinition[] = [
    { field: '업무구분명', name: '업무구분명', type: 'text' },
    { field: '품명', name: '품명', type: 'text' },
    { field: '발주기관명', name: '발주기관명', type: 'text' },
    { field: '배정예산금액', name: '배정예산금액', type: 'number' },

    { field: '접수일시', name: '접수일시', type: 'date' },
    { field: 'keywords', name: '키워드', type: 'text' },
    { field: '등록일시', name: '등록일시', type: 'date' },
  ];

  gridOptions: GridOptions = {
    view: 'table',
    row: {
      clickHandler: (row) => this.router.navigate(['/pre-standard', row['id']]),
    },
  };
}
