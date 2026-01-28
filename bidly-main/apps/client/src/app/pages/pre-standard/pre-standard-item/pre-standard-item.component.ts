import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  viewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkService, PreStandardDto } from '@api-client';
import { RouterLink } from '@angular/router';
import { Icon } from '@client-libs';
import { KoreanCurrencyPipe } from '../../../pipes/korean-currency.pipe';
import { BookmarkStore } from '../../../../stores/bookmark.store';
import Lottie, { AnimationItem } from 'lottie-web';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserStore } from '../../../../stores/user.store';
import { BookmarkIconComponent } from '../../../components/bookmark-icon/bookmark-icon.component';

@Component({
  selector: 'app-pre-standard-item',
  imports: [
    CommonModule,
    RouterLink,
    Icon,
    KoreanCurrencyPipe,
    BookmarkIconComponent,
  ],
  templateUrl: './pre-standard-item.component.html',
  styleUrl: './pre-standard-item.component.css',
})
export class PreStandardItemComponent {
  protected readonly userStore = inject(UserStore);

  // eslint-disable-next-line @angular-eslint/no-output-native
  select = output<PreStandardDto>();
  preStandard = input.required<PreStandardDto>();
  variant = input<'default' | 'card'>('default');
}
