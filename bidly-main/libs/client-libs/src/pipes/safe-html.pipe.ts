import { isPlatformBrowser } from '@angular/common';
import { inject, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  readonly platformId = inject(PLATFORM_ID);

  constructor(private sanitizer: DomSanitizer) {}

  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  transform(html: string): SafeHtml {
    if (!isPlatformBrowser(this.platformId)) return '';

    const decodedHtml = this.decodeHtml(html);
    return this.sanitizer.bypassSecurityTrustHtml(decodedHtml);
  }
}
