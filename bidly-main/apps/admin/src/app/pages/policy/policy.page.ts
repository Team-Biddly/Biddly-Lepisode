/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button, EditorComponent, ToastService, Icon } from '@client-libs';
import { UploadService } from '../../services/upload.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PolicyCreateDto, PolicyDto, PolicyService } from '@api-client';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';
import { Policy } from '@common';

@Component({
  selector: 'app-policy',
  imports: [CommonModule, Button, EditorComponent, ReactiveFormsModule, Icon],
  templateUrl: './policy.page.html',
  styleUrl: './policy.page.css',
})
export default class PolicyPage {
  private readonly uploadService = inject(UploadService);
  private readonly policyService = inject(PolicyService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isExist = signal<boolean>(false);
  isOpen = signal<boolean>(true);
  title = signal<string>(Policy.USE);

  policies = Object.entries(Policy).map(([key, value]) => ({
    key,
    value,
  }));

  uploadHandler = this.uploadService.upload;
  deleteHandler = this.uploadService.delete;

  form: FormGroup = new FormGroup({
    title: new FormControl(this.title(), [Validators.required]),
    content: new FormControl<string | null>('', [Validators.required]),
  });

  $policy = rxResource({
    params: () => ({ title: this.title() || '' }),
    stream: ({ params }) =>
      this.title()
        ? this.policyService.policyControllerFindByTitle(params).pipe(
            tap((data: PolicyDto) => {
              if (!data) this.isExist.set(false);
              this.form.patchValue({
                content: data?.content,
              });
            }),
          )
        : of(undefined),
  });

  async submit(ev?: Event): Promise<void> {
    ev?.stopPropagation();
    ev?.preventDefault();

    const value = this.form.getRawValue();
    const body: PolicyCreateDto = {
      title: this.title(),
      content: value.content || '',
    };

    if (this.isExist()) {
      this.policyService
        .policyControllerUpdate({
          id: this.$policy.value()?.id || '',
          body,
        })
        .subscribe({
          next: () => {
            this.toastService.success('수정되었습니다.');
          },
          error: (err) => {
            this.toastService.error(err.message);
          },
        });
      return;
    }

    this.policyService
      .policyControllerCreate({
        body,
      })
      .subscribe({
        next: () => {
          this.toastService.success('등록되었습니다.');
        },
        error: (err) => {
          this.toastService.error(err.message);
        },
      });
  }
}
