/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InquiryDto, InquiryService, UpdateInquiryDto } from '@api-client';
import { Accordion, Fieldset, ToastService } from '@client-libs';
import { derivedAsync } from 'ngxtension/derived-async';
import { injectParams } from 'ngxtension/inject-params';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-create-inquiry',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Accordion,
    Fieldset,
  ],
  templateUrl: './create-inquiry.page.html',
})
export default class CreateInquiryPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastService = inject(ToastService);
  inquiryService = inject(InquiryService);

  id = injectParams('id');

  /**
   * @name inquiry
   * @type {derivedAsync}
   * @description 1:1문의 상세 조회
   * @returns {void | InquiryDto}
   */
  inquiry = derivedAsync<InquiryDto | void>(() => {
    if (!this.id()) return;
    return this.inquiryService
      .inquiryControllerFindByIdV1({
        id: this.id() ?? '',
      })
      .pipe(
        tap((inquiry: InquiryDto) => {
          this.form.patchValue(inquiry);
        }),
      );
  });

  form = new FormGroup({
    answer: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  invalid = toSignal<boolean>(
    this.form.valueChanges.pipe(map(() => this.form.invalid)),
  );

  /**
   * @name submit
   * @type {method}
   * @description 1:1 문의 답변 등록
   * @param {Event} ev
   * @returns {void}
   */
  submit(ev?: Event): void {
    ev?.stopPropagation();
    ev?.preventDefault();

    if (this.form.invalid) return;
    const body = this.form.getRawValue() as UpdateInquiryDto;

    this.inquiryService
      .inquiryControllerAnswerV1({
        id: this.id()!,
        body,
      })
      .subscribe({
        next: () => {
          this.toastService.success('1:1문의 답변이 등록되었습니다.');
          this.router.navigate(['/inquiry', this.id()]);
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }
}
