import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PreStandardDto, PreStandardService } from '@api-client';
import { Icon, ModalService, Pagination } from '@client-libs';
import dayjs from 'dayjs';
import { NgAutoAnimateDirective } from 'ng-auto-animate';
import { switchMap } from 'rxjs';
import { PreStandardFilterComponent } from './pre-standard-filter/pre-standard-filter.component';
import { PreStandardItemComponent } from './pre-standard-item/pre-standard-item.component';
import { PreStandardPageStore } from './pre-standard.page.store';

@Component({
  selector: 'app-pre-standard',
  imports: [
    CommonModule,
    Icon,
    PreStandardFilterComponent,
    PreStandardItemComponent,
    NgAutoAnimateDirective,
    Pagination,
  ],
  templateUrl: './pre-standard.page.html',
  styleUrl: './pre-standard.page.css',
  providers: [PreStandardPageStore],
})
export default class PreStandardPage {
  protected readonly store = inject(PreStandardPageStore);
  private readonly preStandardService = inject(PreStandardService);
  private readonly modal = inject(ModalService);

  latestLog = toSignal(
    this.preStandardService.preStandardControllerGetLatestLog(),
  );

  selected = signal<PreStandardDto[]>([]);

  searchOptions$ = toObservable(this.store.searchOptions);

  isLoading = signal(false);

  $results = toSignal(
    this.searchOptions$.pipe(
      switchMap((options) =>
        this.preStandardService.preStandardControllerSearch(options),
      ),
    ),
  );

  handleSelect(item: PreStandardDto) {
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
    this.modal.create(PreStandardFilterComponent, {
      providers: [PreStandardPageStore],
    });
  }

  async download() {
    const preStandards = this.$results()?.items as PreStandardDto[] | undefined;
    if (!preStandards || preStandards?.length === 0) return;

    this.preStandardService
      .preStandardControllerDownload({
        body: {
          ids: preStandards.map((b) => b.id),
        },
      })
      .subscribe((response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `비들리_사전규격공개_${preStandards.length}_${dayjs().format('YYYYMMDDHHMM')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  async downloadSelected() {
    const preStandards = this.selected();
    if (preStandards.length === 0) {
      return;
    }

    this.preStandardService
      .preStandardControllerDownload({
        body: {
          ids: preStandards.map((s) => s.id),
        },
      })
      .subscribe((response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `비들리_사전규격공개_${preStandards.length}_${dayjs().format('YYYYMMDDHHMM')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
