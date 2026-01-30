import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderPlanDto } from '@api-client';
import { Icon } from '@client-libs';
import { UserStore } from '../../../../stores/user.store';
import { KoreanCurrencyPipe } from '../../../pipes/korean-currency.pipe';
import { BookmarkIconComponent } from '../../../components/bookmark-icon/bookmark-icon.component';

@Component({
  selector: 'app-order-plan-item',
  imports: [
    CommonModule,
    RouterLink,
    Icon,
    KoreanCurrencyPipe,
    BookmarkIconComponent,
  ],
  templateUrl: './order-plan-item.component.html',
  styleUrl: './order-plan-item.component.css',
})
export class OrderPlanItemComponent {
  protected readonly userStore = inject(UserStore);

  // eslint-disable-next-line @angular-eslint/no-output-native
  select = output<OrderPlanDto>();
  orderPlan = input.required<OrderPlanDto>();
  variant = input<'default' | 'card'>('default');
}
