import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BidService } from '@api-client';
import { Icon, ToastService } from '@client-libs';
import { injectParams } from 'ngxtension/inject-params';
import { of } from 'rxjs';

@Component({
  selector: 'app-bid-detail',
  imports: [DatePipe, DecimalPipe, RouterLink, Icon],
  templateUrl: './bid-detail.page.html',
  styleUrl: './bid-detail.page.css',
})
export default class BidDetailPage {
  private readonly bidService = inject(BidService);
  private readonly bidId = injectParams('bidId');
  private readonly toast = inject(ToastService);

  bid$ = rxResource({
    params: () => this.bidId(),
    stream: ({ params }) =>
      params ? this.bidService.bidControllerFindById({ id: params }) : of(null),
  });

  submit(keyword: string) {
    const bid = this.bid$.value();
    if (!bid) return;

    const keywords = keyword.split(',').map((kw) => kw.trim());

    if (keywords.length === 0) return;
    if (bid.keywords && keywords.every((kw) => bid.keywords!.includes(kw)))
      return;

    this.bidService
      .bidControllerUpdateKeywords({
        id: bid.id,
        body: { keywords },
      })
      .subscribe(() => {
        this.toast.success('키워드가 업데이트되었습니다.');
        this.bid$.reload();
      });
  }
}
