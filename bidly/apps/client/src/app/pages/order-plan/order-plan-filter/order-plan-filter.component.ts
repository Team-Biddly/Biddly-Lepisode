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
import { OrderPlanPageStore } from '../store/order-plan.page.store';

@Component({
  selector: 'app-order-plan-filter',
  imports: [
    CommonModule,
    Icon,
    FormsModule,
    KoreanCurrencyPipe,
    InputKeywordComponent,
  ],
  templateUrl: './order-plan-filter.component.html',
  styleUrl: './order-plan-filter.component.css',
})
export class OrderPlanFilterComponent {
  protected readonly store = inject(OrderPlanPageStore);
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

    this.store.startDate.set(startDate.format('YYYY-MM-DD'));
    this.store.endDate.set(endDate.format('YYYY-MM-DD'));
  }

  search() {
    this.dialogRef?.close();
  }

  reset() {
    this.dialogRef?.close();
    this.store.reset();
  }

  updateValue(target: WritableSignal<string>, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    target.set(value);
  }
}
