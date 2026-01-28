import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserControllerUpdatePassword$Params } from 'libs/api-client/src/lib/fn/user/user-controller-update-password';
import { ToastService } from '@client-libs';
import { UserService } from '@api-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-password.page.html',
  styleUrl: './update-password.page.css',
})
export default class UpdatePasswordPage {
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  passwordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmedPassword: new FormControl('', [Validators.required]),
  });

  onSubmitPassword(ev?: Event): void {
    ev?.stopPropagation();
    ev?.preventDefault();

    const body: UserControllerUpdatePassword$Params = {
      body: {
        oldPassword: this.passwordForm.getRawValue().oldPassword || '',
        password: this.passwordForm.getRawValue().password || '',
        confirmedPassword:
          this.passwordForm.getRawValue().confirmedPassword || '',
      },
    };

    this.userService.userControllerUpdatePassword(body).subscribe({
      next: () => {
        this.toastService.success('비밀번호가 변경되었습니다.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toastService.error(
          err?.error.message || '비밀번호 변경에 실패했습니다.',
        );
      },
    });
  }
}
