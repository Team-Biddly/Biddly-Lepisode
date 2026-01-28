import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { OrderPlanDto, OrderPlanService } from '@api-client';
import { Icon, ModalService, Pagination } from '@client-libs';
import dayjs from 'dayjs';
import { NgAutoAnimateDirective } from 'ng-auto-animate';
import { switchMap } from 'rxjs';
import { OrderPlanFilterComponent } from './order-plan-filter/order-plan-filter.component';
import { OrderPlanItemComponent } from './order-plan-item/order-plan-item.component';
import { OrderPlanPageStore } from './store/order-plan.page.store';

@Component({
  selector: 'app-order-plan',
  imports: [
    CommonModule,
    RouterModule,
    Icon,
    OrderPlanItemComponent,
    Pagination,
    OrderPlanFilterComponent,
    NgAutoAnimateDirective,
  ],
  templateUrl: './order-plan.page.html',
  styleUrl: './order-plan.page.css',
})
export default class OrderPlanPage {
  protected readonly store = inject(OrderPlanPageStore);
  private readonly orderPlanService = inject(OrderPlanService);
  private readonly modal = inject(ModalService);

  searchOptions$ = toObservable(this.store.searchOptions);

  $results = toSignal(
    this.searchOptions$.pipe(
      switchMap((options) =>
        this.orderPlanService.orderPlanControllerSearch(options),
      ),
    ),
  );

  latestLog = toSignal(this.orderPlanService.orderPlanControllerGetLatestLog());

  selected = signal<OrderPlanDto[]>([]);

  handleSelect(item: OrderPlanDto) {
    const selected = this.selected();
    const index = selected.findIndex((i) => i.id === item.id);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(item);
    }
    this.selected.set([...selected]);
  }

  openFilterModal() {
    this.modal.create(OrderPlanFilterComponent);
  }

  async download() {
    const orderPlans = this.$results()?.items as OrderPlanDto[] | undefined;
    if (!orderPlans || orderPlans?.length === 0) return;

    this.orderPlanService
      .orderPlanControllerDownload({
        body: {
          ids: orderPlans.map((b) => b.id),
        },
      })
      .subscribe((response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `비들리_발주계획_${orderPlans.length}_${dayjs().format('YYYYMMDDHHMM')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  async downloadSelected() {
    const orderPlans = this.selected();
    if (orderPlans.length === 0) {
      return;
    }

    this.orderPlanService
      .orderPlanControllerDownload({
        body: {
          ids: orderPlans.map((s) => s.id),
        },
      })
      .subscribe((response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `비들리_발주계획_${orderPlans.length}_${dayjs().format('YYYYMMDDHHMM')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
