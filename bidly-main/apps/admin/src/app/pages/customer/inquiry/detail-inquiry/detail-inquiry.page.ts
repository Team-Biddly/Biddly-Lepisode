import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InquiryDto, InquiryService } from '@api-client';
import { AlertService, Icon, ToastService } from '@client-libs';
import { derivedAsync } from 'ngxtension/derived-async';
import { injectParams } from 'ngxtension/inject-params';
import { filter } from 'rxjs';

@Component({
  selector: 'app-detail-inquiry',
  imports: [CommonModule, RouterLink, Icon],

  templateUrl: './detail-inquiry.page.html',
})
export default class DetailInquiryPage {
  readonly inquiryService = inject(InquiryService);
  readonly alertService = inject(AlertService);
  readonly toastService = inject(ToastService);
  readonly router = inject(Router);

  id = injectParams('id');

  /**
   * @name inquiry
   * @type {derivedAsync}
   * @description 1:1문의 상세 조회
   * @returns {void | InquiryDto}
   */
  inquiry = derivedAsync<void | InquiryDto>(() => {
    if (!this.id()) return;
    return this.inquiryService.inquiryControllerFindByIdV1({ id: this.id()! });
  });

  /**
   * @name handleDelete
   * @type {method}
   * @description 1:1문의 삭제
   * @returns {void}
   */
  handleDelete(): void {
    this.alertService
      .open({
        type: 'error',
        title: '1:1문의 삭제',
        content: `1:1문의를 삭제하시겠습니까?
            삭제되며 삭제 후에는 복구할 수 없습니다.`,
      })
      .closed.pipe(filter((result) => result?.action === 'confirm'))
      .subscribe({
        next: () => {
          this.inquiryService
            .inquiryControllerDeleteV1({ id: this.id()! })
            .subscribe(() => {
              this.router.navigate(['/inquiry'], { replaceUrl: true });
              this.toastService.success('1:1문의가 삭제되었습니다.');
            });
        },
      });
  }
}
