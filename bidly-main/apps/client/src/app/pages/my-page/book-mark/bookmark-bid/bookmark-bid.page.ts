import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BidService } from '@api-client';
import { Icon, Pagination } from '@client-libs';
import { BidItemComponent } from '../../../bid/bid-item/bid-item.component';

@Component({
  selector: 'app-bookmark-bid',
  imports: [CommonModule, Icon, Pagination, BidItemComponent],
  templateUrl: './bookmark-bid.page.html',
  styleUrl: './bookmark-bid.page.css',
})
export default class BidNoticePage {
  private readonly bidService = inject(BidService);

  pageNo = signal(1);
  pageSize = signal(10);

  $result = rxResource({
    params: () => ({
      pageNo: this.pageNo(),
      pageSize: this.pageSize(),
    }),
    stream: ({ params }) => this.bidService.bidControllerGetBookmarked(params),
  });
}
