import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, Icon } from '@client-libs';
import { AdminStore } from '../../../stores/admin.store';
import { UpdateMyInfoComponent } from '../../components/update-my-info/update-my-info.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  standalone: true,
  imports: [CommonModule, Icon, UpdateMyInfoComponent],
})
export class TopBar {
  readonly alertService = inject(AlertService);
  readonly adminStore = inject(AdminStore);
  readonly router = inject(Router);

  readonly admin = this.adminStore.user;

  isMenuOpen = signal<boolean>(false);
  showUpdateMyInfoModal = signal<boolean>(false);

  header = input.required<string>();
  description = input<string>();

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  openUpdateMyInfoModal() {
    this.showUpdateMyInfoModal.set(true);
    this.isMenuOpen.set(false);
  }

  closeUpdateMyInfoModal() {
    this.showUpdateMyInfoModal.set(false);
  }

  @ViewChild('menu') menuRef?: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const menuEl = this.menuRef?.nativeElement;
    if (this.isMenuOpen() && menuEl && !menuEl.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  logout() {
    this.alertService
      .open({
        title: '로그아웃',
        content: '로그아웃 하시겠습니까?',
        type: 'info',
      })
      .closed.subscribe({
        next: async (result) => {
          if (result?.action === 'confirm') {
            await this.adminStore.logout();
            this.router.navigate(['/sign-in']);
          }
        },
      });
  }
}
