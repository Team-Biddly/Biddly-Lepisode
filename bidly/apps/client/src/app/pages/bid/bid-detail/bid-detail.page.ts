/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, inject, ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BidService } from '@api-client';
import { injectParams } from 'ngxtension/inject-params';
import { of } from 'rxjs';

@Component({
  selector: 'app-bid-detail',
  imports: [CommonModule],
  template: ``,
})
export default class BidDetailPage {
  private readonly bidService = inject(BidService);
  private readonly bidId = injectParams('bidId');

  protected readonly $bid: ResourceRef<any> = rxResource({
    params: () => this.bidId(),
    stream: ({ params }) =>
      params ? this.bidService.bidControllerFindById({ id: params }) : of(null),
  });
}
