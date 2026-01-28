import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BidService, BidViewDto } from '@api-client';
import { ModalService, Icon, Pagination } from '@client-libs';
import { switchMap } from 'rxjs';
import { BidFilterComponent } from './bid-filter/bid-filter.component';
import { BidPageStore } from './bid.page.store';
import { BidItemComponent } from './bid-item/bid-item.component';
import dayjs from 'dayjs';

@Component({
  selector: 'app-bid',
  imports: [
    CommonModule,
    BidFilterComponent,
    Icon,
    Pagination,
    BidItemComponent,
  ],
  templateUrl: './bid.page.html',
  styleUrl: './bid.page.css',
  providers: [BidPageStore],
})
export default class BidPage {
  protected readonly store = inject(BidPageStore);
  private readonly bidService = inject(BidService);
  private readonly modal = inject(ModalService);

  latestLog = toSignal(this.bidService.bidControllerGetLatestLog());

  selected = signal<BidViewDto[]>([]);

  searchOptions$ = toObservable(this.store.searchOptions);

  isLoading = signal(false);

  $results = toSignal(
    this.searchOptions$.pipe(
      switchMap((options) => this.bidService.bidControllerSearch(options)),
    ),
  );

  handleSelect(item: BidViewDto) {
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
    this.modal.create(BidFilterComponent, {
      providers: [BidPageStore],
    });
  }

  async download() {
    const bids = this.$results()?.items as BidViewDto[] | undefined;
    if (!bids || bids?.length === 0) return;

    this.bidService
      .bidControllerDownload({
        body: {
          ids: bids.map((b) => b.id),
        },
      })
      .subscribe((response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `비들리_입찰공고_${bids.length}_${dayjs().format('YYYYMMDDHHMM')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  async downloadSelected() {
    const bids = this.selected();
    if (bids.length === 0) {
      return;
    }

    this.bidService
      .bidControllerDownload({
        body: {
          ids: bids.map((s) => s.id),
        },
      })
      .subscribe((response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `비들리_입찰공고_${bids.length}_${dayjs().format('YYYYMMDDHHMM')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
