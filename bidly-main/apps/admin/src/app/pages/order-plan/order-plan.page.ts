import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { OrderPlanDto, OrderPlanService } from '@api-client';
import {
  Align,
  ColumnDefinition,
  GridOptions,
  Icon,
  ServerSidePaginationDataGrid,
  ToastService,
} from '@client-libs';
import dayjs from 'dayjs';
import { linkedQueryParam } from 'ngxtension/linked-query-param';

@Component({
  selector: 'app-order-plan',
  imports: [CommonModule, ServerSidePaginationDataGrid, Icon],
  templateUrl: './order-plan.page.html',
  styleUrl: './order-plan.page.css',
})
export default class OrderPlanPage {
  private readonly orderPlanService = inject(OrderPlanService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  today = dayjs().format('YYYY-MM-DD');

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

  orderPlans$ = rxResource({
    params: () => ({
      pageNo: this.page(),
      pageSize: this.pageSize(),
      query: this.query(),
      orderBy: this.orderBy(),
      align: this.align(),
      type: this.type(),
    }),
    stream: ({ params }) =>
      this.orderPlanService.orderPlanControllerSearch(params),
  });

  columns: ColumnDefinition[] = [
    { field: '업무구분명', name: '업무구분명', type: 'text' },
    { field: '사업명', name: '사업명', type: 'text' },
    { field: '발주기관명', name: '발주기관명', type: 'text' },
    { field: '합계발주금액', name: '합계발주금액', type: 'number' },
    { field: 'keywords', name: '키워드', type: 'text' },
    { field: '게시일시', name: '게시일시', type: 'date' },
  ];

  gridOptions: GridOptions = {
    view: 'table',
    row: {
      clickHandler: (row: OrderPlanDto) =>
        this.router.navigate(['/order-plan', row.id]),
    },
  };

  sync(startDate?: string, endDate?: string) {
    if (!startDate || !endDate) return;

    this.orderPlanService
      .orderPlanControllerSyncOrderPlans({
        startDate,
        endDate,
      })
      .subscribe(() => {
        this.toast.success('발주계획 동기화를 요청했습니다.');
      });
  }
}
