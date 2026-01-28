import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Icon } from '@client-libs';
import { OrderPlanService } from '@api-client';
import { injectParams } from 'ngxtension/inject-params';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { BookmarkIconComponent } from '../../../components/bookmark-icon/bookmark-icon.component';

@Component({
  selector: 'app-order-plan-detail',
  imports: [CommonModule, Icon, BookmarkIconComponent],
  templateUrl: './order-plan-detail.page.html',
  styleUrl: './order-plan-detail.page.css',
})
export default class OrderPlanDetailPage {
  private readonly orderPlanService = inject(OrderPlanService);
  private readonly orderPlanId = injectParams('orderPlanId');
  protected readonly location = inject(Location);

  $orderPlan = rxResource({
    params: () => this.orderPlanId(),
    stream: ({ params }) =>
      params
        ? this.orderPlanService.orderPlanControllerFindById({ id: params })
        : of(null),
  });

  data = computed(() => this.$orderPlan.value());
}
