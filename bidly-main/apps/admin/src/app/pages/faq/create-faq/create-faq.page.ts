/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, ResourceRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { CreateFaqDto, FaqDto, FaqService } from '@api-client';
import { ToastService, Checkbox } from '@client-libs';
import { injectParams } from 'ngxtension/inject-params';

@Component({
  selector: 'app-create-faq',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    Checkbox,
  ],
  templateUrl: './create-faq.page.html',
  styleUrl: './create-faq.page.scss',
})
export default class CreateFaqPage {
  readonly faqService = inject(FaqService);
  readonly router = inject(Router);
  readonly toastService = inject(ToastService);

  id = injectParams('id');

  form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    content: new FormControl<string>('', [Validators.required]),
    isPinned: new FormControl<boolean>(false),
  });

  faq$: ResourceRef<FaqDto | undefined> = rxResource({
    stream: () =>
      this.faqService.faqControllerFindByIdV1({ id: this.id() as string }).pipe(
        tap((faq: FaqDto) => {
          this.form.patchValue({
            title: faq.title,
            content: faq.content,
            isPinned: faq.isPinned,
          });
        }),
      ),
  });

  /**
   * @name submit
   * @description FAQ 등록 | 수정
   * @returns {void}
   */
  submit(): void {
    const check = '{"ops":[{"insert": "\\n"}]}';

    const body: CreateFaqDto = {
      title: this.form.getRawValue().title as string,
      isPinned: this.form.getRawValue().isPinned as boolean,
      content:
        (this.form.getRawValue().content as string) == check
          ? ''
          : (this.form.getRawValue().content ?? ''),
    };

    if (this.id()) {
      this.faqService
        .faqControllerUpdateV1({ id: this.id() as string, body })
        .subscribe({
          next: () => {
            this.toastService.success('FAQ가 수정되었습니다.');
            window.history.back();
          },
          error: (err) => {
            this.toastService.error(err.message);
          },
        });
    } else {
      this.faqService.faqControllerCreateV1({ body }).subscribe({
        next: () => {
          this.toastService.success('FAQ가 등록되었습니다.');
          window.history.back();
        },
        error: (err) => {
          this.toastService.error(err.message);
        },
      });
    }
  }
}
