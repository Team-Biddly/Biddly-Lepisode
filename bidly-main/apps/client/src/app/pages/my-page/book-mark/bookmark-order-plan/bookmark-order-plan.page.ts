import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon, Pagination } from '@client-libs';
import { rxResource } from '@angular/core/rxjs-interop';
import { BidService, OrderPlanService } from '@api-client';
import { OrderPlanItemComponent } from '../../../order-plan/order-plan-item/order-plan-item.component';

@Component({
  selector: 'app-bookmark-order-plan',
  imports: [CommonModule, Icon, OrderPlanItemComponent, Pagination],
  templateUrl: './bookmark-order-plan.page.html',
  styleUrl: './bookmark-order-plan.page.css',
})
export default class BookmarkOrderPlanPage {
  private readonly orderPlanService = inject(OrderPlanService);

  pageNo = signal(1);
  pageSize = signal(10);

  $result = rxResource({
    params: () => ({
      pageNo: this.pageNo(),
      pageSize: this.pageSize(),
    }),
    stream: ({ params }) =>
      this.orderPlanService.orderPlanControllerGetBookmarked(params),
  });
}
