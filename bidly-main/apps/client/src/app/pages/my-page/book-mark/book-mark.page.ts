import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import BidNoticePage from './bookmark-bid/bookmark-bid.page';
import OrderPlanPage from './bookmark-order-plan/bookmark-order-plan.page';
import PreSpecPage from './bookmark-pre-spec/bookmark-pre-spec.page';
import { injectQueryParams } from 'ngxtension/inject-query-params';

@Component({
  selector: 'app-book-mark',
  imports: [
    CommonModule,
    RouterModule,
    OrderPlanPage,
    PreSpecPage,
    BidNoticePage,
  ],
  templateUrl: './book-mark.page.html',
  styleUrl: './book-mark.page.css',
})
export default class BookMarkPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private readonly tab = injectQueryParams('tab');

  currentTab = signal<'order-plan' | 'pre-spec' | 'bid'>('order-plan');

  constructor() {
    const tab = this.tab();
    if (tab && ['order-plan', 'pre-spec', 'bid'].includes(tab)) {
      this.currentTab.set(tab as 'order-plan' | 'pre-spec' | 'bid');
    }

    effect(() => {
      this.router.navigate([], {
        queryParams: { tab: this.currentTab() },
        queryParamsHandling: 'merge',
      });
    });
  }
}
