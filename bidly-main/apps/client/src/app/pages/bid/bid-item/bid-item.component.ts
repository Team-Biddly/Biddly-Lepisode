/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BidViewDto } from '@api-client';
import { Icon } from '@client-libs';
import { UserStore } from '../../../../stores/user.store';
import { BookmarkIconComponent } from '../../../components/bookmark-icon/bookmark-icon.component';
import { KoreanCurrencyPipe } from '../../../pipes/korean-currency.pipe';

@Component({
  selector: 'app-bid-item',
  imports: [
    CommonModule,
    RouterLink,
    Icon,
    KoreanCurrencyPipe,
    BookmarkIconComponent,
  ],
  templateUrl: './bid-item.component.html',
  styleUrl: './bid-item.component.css',
})
export class BidItemComponent {
  protected readonly userStore = inject(UserStore);

  select = output<BidViewDto>();
  bid = input.required<BidViewDto>();
  variant = input<'default' | 'card'>('default');
}
