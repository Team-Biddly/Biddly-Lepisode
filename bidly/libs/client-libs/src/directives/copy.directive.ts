import { Directive, HostListener, inject, input } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Directive({
  selector: '[appCopy]',
})
export class CopyDirective {
  readonly toastService = inject(ToastService);

  content = input.required<string>();

  @HostListener('click', ['$event']) async handleCopyContent(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();
    this.copyText(this.content());
    this.toastService.info('클립보드에 복사되었습니다.');
  }

  private copyText(text: string) {
    navigator.clipboard.writeText(text);
  }
}
