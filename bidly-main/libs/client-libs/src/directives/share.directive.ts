import { Directive, HostBinding, HostListener, input } from '@angular/core';

@Directive({
  selector: '[share]',
  standalone: true,
})
export class ShareDirective {
  title = input.required<string>();
  text = input<string>();

  @HostBinding('class') class = 'cursor-pointer';

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    event.preventDefault();

    const shareData = {
      title: this.title(),
      text: this.text(),
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      console.log('Web Share API is not supported in your browser');
    }
  }
}
