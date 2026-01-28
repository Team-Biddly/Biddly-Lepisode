/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, ResourceRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminDto, AdminService, CreateAdminDto } from '@api-client';
import { ToastService } from '@client-libs';
import { Router, RouterLink } from '@angular/router';
import { injectParams } from 'ngxtension/inject-params';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';

@Component({
  selector: 'app-create-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-admin.page.html',
  styleUrl: './create-admin.page.css',
})
export default class CreateAdminPage {
  readonly adminService = inject(AdminService);
  readonly toastService = inject(ToastService);
  readonly router = inject(Router);

  id = injectParams('id');

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  admin$: ResourceRef<AdminDto | undefined> = rxResource({
    stream: () => {
      const id = this.id();
      if (!id) return of(undefined);
      return this.adminService.adminControllerFindByIdV1({ id }).pipe(
        tap((admin: AdminDto | undefined) => {
          if (admin) {
            this.form.patchValue({
              email: admin.email,
              name: admin.name,
            });
          }
        }),
      );
    },
  });

  /**
   * @name submit
   * @description 관리자 생성 폼 생성 | 수정
   * @returns {void}
   */
  submit(): void {
    const body: CreateAdminDto = {
      email: this.form.getRawValue().email as string,
      password: this.form.getRawValue().password as string,
      passwordConfirm: this.form.getRawValue().passwordConfirm as string,
      name: this.form.getRawValue().name as string,
    };

    if (this.id()) {
      this.adminService
        .adminControllerUpdateV1({
          id: this.id() as string,
          body,
        })
        .subscribe({
          next: () => {
            this.toastService.success('관리자 계정이 수정되었습니다.');
            this.router.navigate(['/super']);
          },
          error: (err) => {
            this.toastService.error(
              `관리자 계정 수정에 실패했습니다: ${err.message}`,
            );
          },
        });
    } else {
      this.adminService.adminControllerCreateV1({ body }).subscribe({
        next: () => {
          this.toastService.success('관리자 계정이 생성되었습니다.');
          this.router.navigate(['/super']);
        },
        error: (err) => {
          this.toastService.error(
            `관리자 계정 생성에 실패했습니다: ${err.message}`,
          );
        },
      });
    }
  }
}
