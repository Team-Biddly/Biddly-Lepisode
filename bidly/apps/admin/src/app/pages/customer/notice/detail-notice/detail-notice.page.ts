/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NoticeDto, NoticeService } from '@api-client';
import {
  Accordion,
  AlertService,
  Icon,
  SafeHtmlPipe,
  TextField,
  ToastService,
} from '@client-libs';
import { derivedAsync } from 'ngxtension/derived-async';
import { injectParams } from 'ngxtension/inject-params';
import { filter } from 'rxjs';

@Component({
  selector: 'app-detail-notice',
  imports: [
    CommonModule,
    RouterModule,
    Icon,
    Accordion,
    TextField,
    SafeHtmlPipe,
  ],
  templateUrl: './detail-notice.page.html',
})
export default class DetailNoticePage {
  readonly noticeService = inject(NoticeService);
  readonly alertService = inject(AlertService);
  readonly toastService = inject(ToastService);
  readonly router = inject(Router);

  id = injectParams('id');

  /**
   * @name notice
   * @description 공지사항 상세 조회
   * @returns {void | NoticeDto}
   */
  notice = derivedAsync<void | NoticeDto>(() => {
    if (!this.id()) return;
    return this.noticeService.noticeControllerFindByIdV1({ id: this.id()! });
  });

  /**
   * @name handleDelete
   * @description 공지사항 삭제
   * @returns {void}
   */
  handleDelete(): void {
    this.alertService
      .open({
        type: 'error',
        title: '공지사항 삭제',
        content: `공지사항을 삭제하시겠습니까?
          삭제되며 삭제 후에는 복구할 수 없습니다.`,
      })
      .closed.pipe(filter((result) => result?.action === 'confirm'))
      .subscribe({
        next: () => {
          this.noticeService
            .noticeControllerDeleteV1({ id: this.id()! })
            .subscribe(() => {
              this.router.navigate(['/notice'], { replaceUrl: true });
              this.toastService.success('공지사항이 삭제되었습니다.');
            });
        },
      });
  }

  handleUpdate() {
    this.router.navigate(['/customer/notice/form', this.id()], {
      replaceUrl: true,
    });
  }

  goBack() {
    window.history.back();
  }
}
