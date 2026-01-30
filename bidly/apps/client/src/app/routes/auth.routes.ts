import { Route } from '@angular/router';
import { LAYOUT_TYPE } from '../layout/header/header.component';

export const authRoutes: Route[] = [
  {
    path: 'login',
    data: { layoutType: LAYOUT_TYPE.ARROW },
    children: [
      {
        path: '',
        loadComponent: () => import('../pages/auth/sign-in/sign-in.page'),
      },
      {
        path: ':provider',
        loadComponent: () => import('../pages/auth/sign-in/sign-in.page'),
      },
    ],
  },
  {
    path: 'user',
    children: [
      // {
      //   path: 'sign-in',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () => import('../pages/auth/sign-in/sign-in.page'),
      //     },
      //     {
      //       path: ':provider',
      //       loadComponent: () => import('../pages/auth/sign-in/sign-in.page'),
      //     },
      //   ],
      // },
      {
        path: 'sign-up',
        data: { layoutType: LAYOUT_TYPE.ARROW },
        loadComponent: () => import('../pages/auth/sign-up/sign-up.page'),
      },
      {
        path: 'find-email',
        data: { layoutType: LAYOUT_TYPE.ARROW },
        loadComponent: () => import('../pages/auth/find-email/find-email.page'),
      },
      {
        path: 'find-password',
        data: { layoutType: LAYOUT_TYPE.ARROW },
        loadComponent: () =>
          import('../pages/auth/find-password/find-password.page'),
      },
      {
        path: 'confirm-email',
        data: { layoutType: LAYOUT_TYPE.ARROW },
        loadComponent: () =>
          import('../pages/auth/confirm-email/confirm-email.page'),
      },
      {
        path: 'reset-password',
        data: { layoutType: LAYOUT_TYPE.ARROW },
        loadComponent: () =>
          import('../pages/auth/reset-password/reset-password.page'),
      },
    ],
  },
];
