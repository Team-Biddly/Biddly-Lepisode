import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { AdminStore } from '../../stores/admin.store';
import { IMenu, LayoutStore } from '../../stores/layout.store';
import { SideMenuModule } from './side-menu/side-menu.module';
import { TopBar } from './top-bar/top-bar.component';

@Component({
  host: { ngSkipHydration: 'true' },
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, TopBar, SideMenuModule],
})
export class LayoutComponent implements OnInit {
  readonly store = inject(LayoutStore);
  private readonly adminStore = inject(AdminStore);
  private readonly router = inject(Router);

  private readonly navigationEnd$ = injectNavigationEnd();

  admin = computed(() => this.adminStore.user());

  currentMenu = this.store.currentMenu;
  currentChildMenu = this.store.currentChildMenu;
  path = this.store.path;
  menus = this.store.menus;

  menuItem: IMenu[] = [
    {
      icon: 'mdi:home-outline',
      name: '대시보드',
      description: '대시보드',
      href: '/dashboard',
    },
    {
      icon: 'mdi:account-supervisor-outline',
      name: '회원 관리',
      description: '회원 관리',
      href: '/user',
    },
    {
      icon: 'mdi:help-circle-outline',
      name: '조달 정보 관리',
      children: [
        {
          name: '발주 계획 관리',
          description: '발주 계획 관리',
          href: '/order-plan',
        },
        {
          name: '사전 규격 관리',
          description: '사전 규격 관리',
          href: '/pre-standard',
        },
        {
          name: '입찰 공고 관리',
          description: '입찰 공고 관리',
          href: '/bid',
        },
      ],
    },
    {
      icon: 'mdi:file-cog-outline',
      name: 'FAQ 관리',
      description: 'FAQ 관리',
      href: '/faq',
    },
    {
      icon: 'mdi:help-circle-outline',
      name: '시스템 관리',
      children: [
        {
          name: '약관 관리',
          description: '약관 관리',
          href: '/policy',
        },
        {
          name: '사업자 정보 관리',
          description: '사업자 정보 관리',
          href: '/business-info',
        },
        { name: '배너 관리', description: '배너 관리', href: '/banner' },
      ],
    },
    {
      icon: 'mdi:account-circle-outline',
      name: '관리자 관리',
      description: '관리자 관리',
      href: '/super',
      super: this.admin()?.role !== 'SUPER_ADMIN',
    },
  ];

  ngOnInit() {
    this.store.setMenus(this.menuItem, this.admin()?.role === 'SUPER_ADMIN');
    this.store.setPath(this.router.url);

    this.navigationEnd$.subscribe({
      next: () => {
        this.store.setPath(this.router.url);
      },
    });
  }

  navigate(menu: IMenu) {
    this.router.navigateByUrl(menu.href!);
  }
}
