import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '@client-libs';
import dayjs from 'dayjs';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { InputKeywordComponent } from '../../../components/input-keyword/input-keyword.component';
import { KoreanCurrencyPipe } from '../../../pipes/korean-currency.pipe';
import { BidPageStore } from '../bid.page.store';

@Component({
  selector: 'app-bid-filter',
  imports: [
    CommonModule,
    Icon,
    FormsModule,
    KoreanCurrencyPipe,
    InputKeywordComponent,
  ],
  templateUrl: './bid-filter.component.html',
  styleUrl: './bid-filter.component.css',
})
export class BidFilterComponent {
  protected readonly store = inject(BidPageStore);
  private readonly options = injectQueryParams();
  protected readonly dialogRef = inject(DialogRef, { optional: true });

  today = dayjs().format('YYYY-MM-DD');

  startDateMax = computed(() =>
    this.store['입찰개시일시시작']()
      ? dayjs(this.store.endDate()).subtract(1, 'day').format('YYYY-MM-DD')
      : this.today,
  );

  advanced = signal(false);

  constructor() {
    const options = this.options();
    if (options) {
      this.store.setOptions(options);
    }
  }

  setDateRange(range: 'today' | '1w' | '1m') {
    const endDate = dayjs();

    let startDate;

    switch (range) {
      case 'today':
        startDate = endDate;
        break;
      case '1w':
        startDate = endDate.subtract(7, 'day');
        break;
      case '1m':
        startDate = endDate.subtract(1, 'month');
        break;
    }

    this.store['입찰개시일시시작'].set(startDate.format('YYYY-MM-DD'));
    this.store['입찰개시일시종료'].set(endDate.format('YYYY-MM-DD'));
  }

  updateValue(target: WritableSignal<string>, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    target.set(value);
  }
}
