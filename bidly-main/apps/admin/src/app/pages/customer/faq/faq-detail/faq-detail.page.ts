import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FaqService } from '@api-client';
import {
  Accordion,
  AlertService,
  Icon,
  SafeHtmlPipe,
  TextField,
  ToastService,
} from '@client-libs';
import { injectParams } from 'ngxtension/inject-params';
import { of } from 'rxjs';

@Component({
  selector: 'app-faq-detail',
  imports: [CommonModule, Accordion, SafeHtmlPipe, RouterLink, TextField, Icon],
  templateUrl: './faq-detail.page.html',
  styleUrl: './faq-detail.page.css',
})
export default class FaqDetailPage {
  readonly faqService = inject(FaqService);
  readonly alertService = inject(AlertService);
  readonly toastService = inject(ToastService);
  readonly router = inject(Router);
  readonly id = injectParams('id');

  $faq = rxResource({
    request: () => this.id(),
    stream: ({ request }) =>
      request
        ? this.faqService.faqControllerFindByIdV1({ id: request })
        : of(null),
  });

  faq = this.$faq.value;

  handleUpdate() {
    this.router.navigate(['/customer/faq/form'], {
      queryParams: {
        id: this.id(),
      },
      replaceUrl: true,
    });
  }

  handleDelete() {
    this.alertService
      .open({
        title: 'FAQ 삭제',
        content: 'FAQ를 삭제하시겠습니까?',
        buttons: { confirm: { text: '삭제' }, cancel: { text: '취소' } },
        type: 'error',
      })
      .closed.subscribe((result) => {
        if (result?.action === 'confirm') {
          this.faqService
            .faqControllerDeleteV1({ id: this.id()! })
            .subscribe(() => {
              this.toastService.success('FAQ가 삭제되었습니다.');
              this.router.navigate(['/customer/faq'], { replaceUrl: true });
            });
        }
      });
  }
}
