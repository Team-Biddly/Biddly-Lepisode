import {
  AfterViewInit,
  Directive,
  ElementRef,
  input,
  model,
  output,
} from '@angular/core';
import { debounceTime, fromEvent } from 'rxjs';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective implements AfterViewInit {
  hasNext = input<boolean>(false);
  next = output<void>();

  type = model<'window' | 'element'>('window');

  constructor(private readonly el: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.type() === 'window') {
      fromEvent(window, 'scroll')
        .pipe(debounceTime(300))
        .subscribe(() => {
          const scrollPosition = window.innerHeight + window.scrollY;
          const threshold = document.body.offsetHeight - 100;
          if (scrollPosition > threshold) {
            if (this.hasNext() && this.next) {
              this.next.emit();
            }
          }
        });
      return;
    }

    fromEvent(this.el.nativeElement, 'scroll')
      .pipe(debounceTime(300))
      .subscribe(() => {
        const scrollPosition =
          this.el.nativeElement.scrollTop + this.el.nativeElement.clientHeight;
        const threshold = this.el.nativeElement.scrollHeight - 100;

        if (scrollPosition > threshold) {
          if (this.hasNext() && this.next) {
            this.next.emit();
          }
        }
      });
  }
}
