import { CommonModule, Location } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FaqService, StorageService } from '@api-client';
import {
  Accordion,
  EditorComponent,
  Fieldset,
  ToastService,
} from '@client-libs';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { of, tap } from 'rxjs';

@Component({
  selector: 'app-faq-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Accordion,
    Fieldset,
    EditorComponent,
  ],
  templateUrl: './faq-form.page.html',
  styleUrl: './faq-form.page.css',
})
export default class FaqFormPage {
  readonly location = inject(Location);
  readonly id = injectQueryParams('id');
  readonly faqService = inject(FaqService);
  readonly storageService = inject(StorageService);
  readonly toastService = inject(ToastService);
  readonly router = inject(Router);

  $faq = rxResource({
    request: () => this.id(),
    stream: ({ request }) =>
      request
        ? this.faqService
            .faqControllerFindByIdV1({ id: request })
            .pipe(tap((res) => this.form.patchValue({ ...res })))
        : of(null),
  });

  form = new FormGroup({
    isPinned: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    question: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    answer: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  faq = computed(() => this.$faq.value());

  async submit() {
    const id = this.id();

    if (id) {
      this.faqService
        .faqControllerUpdateV1({ id, body: { ...this.form.getRawValue() } })
        .subscribe((res) => {
          this.toastService.success('FAQ 가 수정되었습니다.');
          this.router.navigate(['/customer/faq', res.id], { replaceUrl: true });
        });
      return;
    }

    this.faqService
      .faqControllerCreateV1({ body: { ...this.form.getRawValue() } })
      .subscribe((res) => {
        this.toastService.success('FAQ가 등록되었습니다.');
        this.router.navigate(['/customer/faq', res.id], { replaceUrl: true });
      });
  }
}
