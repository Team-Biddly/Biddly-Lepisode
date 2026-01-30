import { Route } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/auth/sign-in/sign-in.page'),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page'),
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/user/user.page'),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/user/user-detail/user-detail.page'),
          },
        ],
      },
      {
        path: 'order-plan',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/order-plan/order-plan.page'),
          },
          {
            path: ':orderPlanId',
            loadComponent: () =>
              import(
                './pages/order-plan/order-plan-detail/order-plan-detail.page'
              ),
          },
        ],
      },
      {
        path: 'pre-standard',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/pre-standard/pre-standard.page'),
          },
          {
            path: ':prestandardId',
            loadComponent: () =>
              import(
                './pages/pre-standard/pre-standard-detail/pre-standard-detail.page'
              ),
          },
        ],
      },
      {
        path: 'bid',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/bid/bid.page'),
          },
          {
            path: ':bidId',
            loadComponent: () =>
              import('./pages/bid/bid-detail/bid-detail.page'),
          },
        ],
      },
      {
        path: 'faq',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/faq/faq.page'),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./pages/faq/create-faq/create-faq.page'),
          },
          {
            path: 'update',
            children: [
              {
                path: ':id',
                loadComponent: () =>
                  import('./pages/faq/create-faq/create-faq.page'),
              },
            ],
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/faq/detail-faq/detail-faq.page'),
          },
        ],
      },
      {
        path: 'super',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/super/super.page'),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./pages/super/create-admin/create-admin.page'),
          },
          {
            path: 'update',
            children: [
              {
                path: ':id',
                loadComponent: () =>
                  import('./pages/super/create-admin/create-admin.page'),
              },
            ],
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/super/detail-admin/detail-admin.page'),
          },
        ],
      },
      {
        path: 'policy',
        children: [
          {
            path: '',
            redirectTo: '이용약관',
            pathMatch: 'full',
          },
          {
            path: ':title',
            loadComponent: () => import('./pages/policy/policy.page'),
          },
        ],
      },
      {
        path: 'business-info',
        loadComponent: () => import('./pages/business-info/business-info.page'),
      },
      {
        path: 'banner',
        children: [
          {
            path: '',
            redirectTo: '웹용',
            pathMatch: 'full',
          },
          {
            path: ':mode',
            loadComponent: () => import('./pages/banner/banner.page'),
          },
          // {
          //   path: ':id',
          //   loadComponent: () =>
          //     import('./pages/banner/banner-detail/banner-detail.page'),
          // },
        ],
      },
    ],
  },
];
