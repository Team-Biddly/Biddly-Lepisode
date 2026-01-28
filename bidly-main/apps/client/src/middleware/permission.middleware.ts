// import { Component, inject, OnInit, signal } from '@angular/core';
// import { Router } from '@angular/router';
// import { MenuDto, MenuPermissionDto } from '@api-client';
// import { injectNavigationEnd } from 'ngxtension/navigation-end';
// import { toObservableSignal } from 'ngxtension/to-observable-signal';
// import { UserStore } from '../stores/user.store';
// import { MenuStore } from '../stores/menu.store';

// /**
//  * 권한 미들웨어
//  * 사용자의 권한을 확인하고, 권한이 없는 경우 에러 페이지로 리다이렉트합니다.
//  */
// @Component({
//   selector: 'app-permission-middleware',
//   template: '',
// })
// export class PermissionMiddleware implements OnInit {
//   private readonly menuStore = inject(MenuStore);
//   private readonly userStore = inject(UserStore);
//   private readonly menu = this.menuStore.menu;
//   readonly user = this.userStore.user;

//   readonly router = inject(Router);
//   readonly navigationEnd$ = injectNavigationEnd();

//   /**
//    * 현재 접속한 페이지의 권한 정보
//    */
//   private currentPermission = signal<MenuDto | null>(null);
//   private currentPermission$ = toObservableSignal(this.currentPermission);

//   ngOnInit() {
//     this.handleFindMenu();

//     this.navigationEnd$.subscribe({
//       next: () => {
//         this.handleFindMenu();
//       },
//     });

//     this.currentPermission$.subscribe({
//       next: (res) => {
//         const user = this.user();
//         const permission = user?.permission;

//         // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
//         if (!user) {
//           this.router.navigate(['/sign-in']);
//           return;
//         }

//         // 권한이 없는 경우 에러 페이지로 리다이렉트
//         if (!permission) {
//           this.router.navigate(['/error/no-permission']);
//           return;
//         }

//         // 최고 권한일 경우
//         if (permission.super) {
//           return;
//         }

//         this.handlePermission(res!);
//       },
//     });
//   }

//   /**
//    * 현재 경로에 해당하는 메뉴를 찾습니다.
//    */
//   private handleFindMenu() {
//     const path = window.location.pathname;
//     this.currentPermission.set(null);

//     this.menu.subscribe({
//       next: (menu) => {
//         if (menu) {
//           this.findMenuItem(menu, path);
//         }
//       },
//     });
//   }

//   /**
//    * 현재 메뉴의 권한을 확인합니다.
//    * @param menu
//    */
//   private handlePermission(menu: MenuDto) {
//     const user = this.user();
//     const permission = user?.permission;

//     if (menu) {
//       // 권한 체크
//       const permissionList = this.findPermission(menu);
//       if (!permissionList || !permissionList?.length) return;

//       const hasPermission = permissionList?.find(
//         (item) =>
//           item.role?.id === permission?.role?.id &&
//           item.level <= permission?.level,
//       );

//       // 권한이 없는 경우 에러 페이지로 리다이렉트
//       if (!hasPermission) {
//         this.router.navigate(['/error/no-permission']);
//         return;
//       }

//       switch (menu.pageType) {
//         case 'READ': {
//           if (!hasPermission.canRead)
//             this.router.navigate(['/error/no-permission']);
//           break;
//         }
//         case 'CREATE': {
//           if (!hasPermission.canCreate)
//             this.router.navigate(['/error/no-permission']);
//           break;
//         }
//         case 'UPDATE': {
//           if (!hasPermission.canUpdate)
//             this.router.navigate(['/error/no-permission']);
//           break;
//         }
//       }
//     }
//   }

//   /**
//    * 재귀적으로 메뉴를 탐색하여 현재 메뉴의 권한을 찾습니다.
//    * @param menu
//    * @returns
//    */
//   private findPermission(menu: MenuDto): MenuPermissionDto[] {
//     if (menu) {
//       const permissionList = menu.permissions as MenuPermissionDto[];

//       if (permissionList?.length === 0) {
//         return this.findPermission(menu.parent);
//       }

//       return permissionList;
//     }

//     return [];
//   }

//   /**
//    *  재귀적으로 메뉴를 탐색하여 현재 경로와 일치하는 메뉴를 찾습니다.
//    * @param menu
//    * @param path
//    * @returns
//    */
//   private findMenuItem(menu: any, path: string) {
//     if (!menu) return;

//     // 현재 메뉴에서 탐색
//     menu.children?.forEach((item: any) => {
//       if (item.routeUrl === path) {
//         this.currentPermission.set(item);
//       }

//       // 재귀 호출 (하위 메뉴 탐색)
//       this.findMenuItem(item, path);
//     });
//   }
// }
