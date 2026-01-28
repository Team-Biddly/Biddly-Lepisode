import { Route } from '@angular/router';

export const UserRoutes: Route[] = [
  {
    path: 'user',
    children: [
      {
        path: '',
        loadComponent: () => import('../pages/user/list/list.page'),
      },
      {
        path: 'role',
        loadComponent: () => import('../pages/user/role/role.page'),
      },
      {
        path: 'menu',
        loadComponent: () => import('../pages/user/menu/menu.page'),
      },
      {
        path: 'form',
        loadComponent: () => import('../pages/user/form/user-form.page'),
      },
    ],
  },
];
