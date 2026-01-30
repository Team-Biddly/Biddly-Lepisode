import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStore } from '../../../../stores/user.store';
import UpdateMyInfoPage from './update-my-info/update-my-info.page';
import UpdatePasswordPage from './update-password/update-password.page';

@Component({
  selector: 'app-update-info',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UpdatePasswordPage,
    UpdateMyInfoPage,
  ],
  templateUrl: './update-info.page.html',
  styleUrl: './update-info.page.css',
})
export default class UpdateInfoPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private readonly userStore = inject(UserStore);

  currentTab: 'info' | 'password' = 'info';

  isEmailUser = this.userStore.isEmailUser;

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      if (tab === 'info' || tab === 'password') {
        this.currentTab = tab;
      }
    });
  }

  changeTab(tab: string) {
    this.router.navigate([], {
      queryParams: { tab },
    });
  }
}
