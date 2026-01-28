import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { OrderPlanService } from '@api-client';
import { Icon, ToastService } from '@client-libs';
import { injectParams } from 'ngxtension/inject-params';
import { of } from 'rxjs';

@Component({
  selector: 'app-order-plan-detail',
  imports: [RouterLink, DatePipe, Icon, DecimalPipe],
  templateUrl: './order-plan-detail.page.html',
  styleUrl: './order-plan-detail.page.css',
})
export default class OrderPlanDetailPage {
  private readonly orderPlanService = inject(OrderPlanService);
  private readonly orderPlanId = injectParams('orderPlanId');
  private readonly toast = inject(ToastService);

  orderPlan$ = rxResource({
    params: () => this.orderPlanId(),
    stream: ({ params }) =>
      params
        ? this.orderPlanService.orderPlanControllerFindById({ id: params })
        : of(null),
  });

  submit(keyword: string) {
    const orderPlan = this.orderPlan$.value();
    if (!orderPlan) return;
    const keywords = keyword.split(',').map((kw) => kw.trim());

    if (keywords.length === 0) return;
    if (
      orderPlan.keywords &&
      keywords.every((kw) => orderPlan.keywords.includes(kw))
    )
      return;

    this.orderPlanService
      .orderPlanControllerUpdateKeywords({
        id: orderPlan.id,
        body: { keywords },
      })
      .subscribe(() => {
        this.toast.success('키워드가 업데이트되었습니다.');
        this.orderPlan$.reload();
      });
  }
}
