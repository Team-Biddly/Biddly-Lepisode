import { Directive, HostBinding, HostListener, input } from '@angular/core';

@Directive({
  selector: '[download]',
  standalone: true,
})
export class DownloadDirective {
  fileName = input.required<string>();
  fileUrl = input.required<string>();

  @HostBinding('class') class = 'cursor-pointer';

  @HostListener('click', ['$event']) async onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const res = await fetch(this.fileUrl());
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = this.fileName();
    a.target = '_blank';
    a.click();
  }
}
