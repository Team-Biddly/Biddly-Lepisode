/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CreateNoticeDto, NoticeDto, NoticeService } from '@api-client';
import {
  Accordion,
  Checkbox,
  Fieldset,
  InputDirective,
  ToastService,
} from '@client-libs';
import { derivedAsync } from 'ngxtension/derived-async';
import { injectParams } from 'ngxtension/inject-params';
import { filter, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-create-notice',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Checkbox,
    InputDirective,
    Accordion,
    RouterLink,
    Fieldset,
  ],
  templateUrl: './create-notice.page.html',
})
export default class CreateNoticePage {
  noticeService = inject(NoticeService);
  router = inject(Router);
  toastService = inject(ToastService);

  id = injectParams('id');

  form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    content: new FormControl<string>('', [Validators.required]),
    isPinned: new FormControl<boolean>(false),
  });

  fetch = derivedAsync(() =>
    of(this.id()).pipe(
      filter((id) => !!id),
      switchMap(() =>
        this.noticeService.noticeControllerFindByIdV1({ id: this.id()! }).pipe(
          tap((notice: NoticeDto) => {
            this.form.patchValue(notice);
          }),
        ),
      ),
    ),
  );

  /**
   * @name submit
   * @description 공지사항 등록 | 수정
   * @returns {void}
   */
  submit(): void {
    const check = '{"ops":[{"insert":"\\n"}]}';

    const body: CreateNoticeDto = {
      title: this.form.getRawValue().title!,
      isPinned: this.form.getRawValue()?.isPinned!,
      content:
        this.form.getRawValue().content! == check
          ? ''
          : (this.form.getRawValue().content ?? ''),
    };

    if (this.id()) {
      this.noticeService
        .noticeControllerUpdateV1({ id: this.id()!, body })
        .subscribe({
          next: () => {
            this.toastService.success('공지사항이 수정되었습니다.');
            window.history.back();
          },
        });
    } else {
      this.noticeService.noticeControllerCreateV1({ body }).subscribe({
        next: () => {
          this.toastService.success('공지사항이 등록되었습니다.');
          window.history.back();
        },
      });
    }
  }
}
