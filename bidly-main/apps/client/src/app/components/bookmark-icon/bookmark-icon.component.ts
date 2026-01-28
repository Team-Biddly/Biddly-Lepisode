import {
  afterNextRender,
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '@api-client';
import { BookmarkStore } from '../../../stores/bookmark.store';
import Lottie, { AnimationItem } from 'lottie-web';
import bookmarkIcon from './bookmark.json';
import { toObservable } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-bookmark-icon',
  imports: [CommonModule],
  templateUrl: './bookmark-icon.component.html',
  styleUrl: './bookmark-icon.component.css',
})
export class BookmarkIconComponent implements AfterViewInit {
  private readonly containerRef =
    viewChild.required<ElementRef<HTMLElement>>('container');

  private readonly bookmarkService = inject(BookmarkService);
  private readonly bookmarkStore = inject(BookmarkStore);

  bookmarked = computed(() =>
    this.bookmarkStore.isBookmarked(this.modelId(), this.modelName()),
  );

  bookmarked$ = toObservable(this.bookmarked);

  modelId = input.required<string>();
  modelName = input.required<'입찰공고' | '발주계획' | '사전규격'>();

  animation: AnimationItem | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.animation = Lottie.loadAnimation({
        container: this.containerRef().nativeElement,
        renderer: 'svg',
        autoplay: false,
        loop: false,
        animationData: bookmarkIcon,
      });

      /** 최초 상태 설정 */
      const bookmarked = this.bookmarked();
      if (bookmarked) {
        this.animation?.goToAndStop(14, true);
      } else {
        this.animation?.goToAndStop(0, true);
      }
    }, 50);

    /** 즐겨찾기 여부에 따라 애니메이션 재생 */
    this.bookmarked$.subscribe((bookmarked) => {
      if (bookmarked) {
        this.animation?.playSegments([0, 14], true);
      } else {
        this.animation?.playSegments([14, 0], true);
      }
    });
  }

  toggleBookmark() {
    this.bookmarkService
      .bookmarkControllerToggle({
        body: {
          modelId: this.modelId(),
          modelName: this.modelName(),
        },
      })
      .subscribe((bookmarked) => {
        this.bookmarkStore.refresh();
      });
  }
}
