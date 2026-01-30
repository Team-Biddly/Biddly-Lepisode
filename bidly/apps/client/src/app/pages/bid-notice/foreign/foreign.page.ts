
import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject, signal } from '@angular/core';
import { BidService } from '@api-client';
import { ToastService } from '@client-libs';
import { injectParams } from 'ngxtension/inject-params';

@Component({
  selector: 'app-foreign',
  templateUrl: './foreign.page.html',
  styleUrls: ['./foreign.page.css'],
  imports: [CommonModule]
})
export default class ForeignPage {

  private readonly bidService = inject(BidService);
  private readonly toast = inject(ToastService);

  bidId = injectParams('id')
  foreignBids = signal<BidForeignDto>(undefined);

  constructor() {
    afterNextRender(() => {
      if (!this.bidId()) {
        this.toast.error('공고 정보를 불러오는 데 실패했습니다.');
        return;
      } else {
        this.bidService.bidControllerFindById({ id: this.bidId()! }).subscribe({
          next: (res) => {
            this.foreignBids.set(res);
          },
          error: (error) => {
            this.toast.error('공고 정보를 불러오는 데 실패했습니다.');
          }
        })
      }
    })
  }

}
