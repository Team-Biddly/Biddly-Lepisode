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
import { Router, RouterLink } from '@angular/router';
import { UserService } from '@api-client';
import { LocalStorageService, ToastService } from '@client-libs';
import { ACCESS_TOKEN_KEY } from '@common';
import { map } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.css',
})
export default class ResetPasswordPage {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly userService = inject(UserService);

  token = String(this.localStorageService.get(ACCESS_TOKEN_KEY) || '');

  form = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmedPassword: new FormControl('', [Validators.required]),
  });

  invalid = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.invalid)),
    { initialValue: this.form.invalid },
  );

  onSubmit(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.invalid()) return;

    if (
      this.form.get('password')!.value !==
      this.form.get('confirmedPassword')!.value
    ) {
      this.toastService.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    this.userService
      .userControllerResetPassword({
        body: {
          password: this.form.get('password')!.value!,
          confirmedPassword: this.form.get('confirmedPassword')!.value!,
          token: this.token,
        },
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/login'], { replaceUrl: true });
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }
}
