import { Route } from '@angular/router';
import { LAYOUT_TYPE } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { authRoutes } from './routes/auth.routes';
import { errorRoutes } from './routes/error.routes';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      ...errorRoutes,
      ...authRoutes,
      {
        path: '',
        loadComponent: () => import('./pages/home/home.page'),
      },
      {
        path: 'faq',
        loadComponent: () => import('./pages/faq/faq.page'),
      },
      {
        path: 'introduce',
        loadComponent: () => import('./pages/introduce/introduce.page'),
      },
      {
        path: 'my-page',
        loadComponent: () => import('./pages/my-page/my-page.page'),
        children: [
          {
            path: 'book-mark',
            data: { layoutType: LAYOUT_TYPE.ARROW },
            loadComponent: () =>
              import('./pages/my-page/book-mark/book-mark.page'),
          },
          {
            path: 'update-info',
            data: { layoutType: LAYOUT_TYPE.ARROW },
            loadComponent: () =>
              import('./pages/my-page/update-info/update-info.page'),
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
            data: { layoutType: LAYOUT_TYPE.ARROW },
            loadComponent: () =>
              import('./pages/order-plan/order-plan-detail/order-plan-detail.page'),
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
            path: ':preStandardId',
            loadComponent: () =>
              import('./pages/pre-standard/pre-standard-detail/pre-standard-detail.page'),
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
            path: 'construction/:bidId',
            loadComponent: () =>
              import('./pages/bid/bid-construction/bid-construction.page'),
          },
          {
            path: 'service/:bidId',
            loadComponent: () =>
              import('./pages/bid/bid-service/bid-service.page'),
          },
          {
            path: 'thing/:bidId',
            loadComponent: () => import('./pages/bid/bid-thing/bid-thing.page'),
          },
          {
            path: 'foreign/:bidId',
            loadComponent: () =>
              import('./pages/bid/bid-foreign/bid-foreign.page'),
          },
          {
            path: 'etc/:bidId',
            loadComponent: () => import('./pages/bid/bid-etc/bid-etc.page'),
          },
        ],
      },
    ],
  },
];
