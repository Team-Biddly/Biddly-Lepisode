import { Route } from '@angular/router';

export const CustomerRoutes: Route[] = [
  {
    path: 'customer',
    children: [
      {
        path: '',
        redirectTo: 'inquiry',
        pathMatch: 'full',
      },
      {
        path: 'inquiry',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../pages/customer/inquiry/inquiry.page'),
          },
          {
            path: 'form',
            loadComponent: () =>
              import(
                '../pages/customer/inquiry/create-inquiry/create-inquiry.page'
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                '../pages/customer/inquiry/detail-inquiry/detail-inquiry.page'
              ),
          },
        ],
      },
      {
        path: 'notice',
        children: [
          {
            path: '',
            loadComponent: () => import('../pages/customer/notice/notice.page'),
          },
          {
            path: 'form',
            loadComponent: () =>
              import(
                '../pages/customer/notice/create-notice/create-notice.page'
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                '../pages/customer/notice/detail-notice/detail-notice.page'
              ),
          },
        ],
      },
      {
        path: 'faq',
        children: [
          {
            path: '',
            loadComponent: () => import('../pages/customer/faq/faq.page'),
          },
          {
            path: 'form',
            loadComponent: () =>
              import('../pages/customer/faq/faq-form/faq-form.page'),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('../pages/customer/faq/faq-detail/faq-detail.page'),
          },
        ],
      },
    ],
  },
];
