import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStore } from '../../../../stores/user.store';

@Component({
  selector: 'app-confirm-email',
  imports: [CommonModule, RouterLink],
  templateUrl: './confirm-email.page.html',
  styleUrl: './confirm-email.page.css',
})
export default class ConfirmEmailPage {
  private readonly userStore = inject(UserStore);

  user = this.userStore.$user;
}
