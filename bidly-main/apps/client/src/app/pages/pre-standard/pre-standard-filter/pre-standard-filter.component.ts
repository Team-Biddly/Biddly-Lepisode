import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '@client-libs';
import dayjs from 'dayjs';
import { KoreanCurrencyPipe } from '../../../pipes/korean-currency.pipe';
import { PreStandardPageStore } from '../pre-standard.page.store';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { InputKeywordComponent } from '../../../components/input-keyword/input-keyword.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-pre-standard-filter',
  imports: [
    CommonModule,
    Icon,
    FormsModule,
    KoreanCurrencyPipe,
    InputKeywordComponent,
  ],
  templateUrl: './pre-standard-filter.component.html',
  styleUrl: './pre-standard-filter.component.css',
})
export class PreStandardFilterComponent {
  protected readonly store = inject(PreStandardPageStore);
  private readonly options = injectQueryParams();
  protected readonly dialogRef = inject(DialogRef, { optional: true });

  today = dayjs().format('YYYY-MM-DD');

  startDateMax = computed(() =>
    this.store.endDate()
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

  setDateRange(range: '1m' | '3m' | '6m') {
    const endDate = dayjs();

    let startDate;

    switch (range) {
      case '1m':
        startDate = endDate.subtract(1, 'month');
        break;
      case '3m':
        startDate = endDate.subtract(3, 'month');
        break;
      case '6m':
        startDate = endDate.subtract(6, 'month');
        break;
    }

    this.store.startDate.set(startDate.format('YYYY-MM-DD'));
    this.store.endDate.set(endDate.format('YYYY-MM-DD'));
  }
}
