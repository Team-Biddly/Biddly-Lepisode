import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '@api-client';
import { ToastService } from '@client-libs';

@Component({
  selector: 'app-update-my-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-my-info.component.html',
})
export class UpdateMyInfoComponent {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    passwordConfirm: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

  readonly closeClick = output<void>();

  onSubmit(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();

    const body = {
      email: this.form.get('email')?.value ?? '',
      password: this.form.get('password')?.value ?? '',
      passwordConfirm: this.form.get('passwordConfirm')?.value ?? '',
      name: this.form.get('name')?.value ?? '',
    };

    if (this.form.valid) {
      this.adminService.adminControllerUpdateMyInfoV1({ body }).subscribe({
        next: () => {
          this.toastService.success('내 정보가 수정되었습니다.');
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error(err.message);
        },
      });
    }
  }

  closeModal() {
    this.closeClick.emit();
  }
}
