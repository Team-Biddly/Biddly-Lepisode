import { Route } from '@angular/router';

export const errorRoutes: Route[] = [
  {
    path: 'error',
    children: [
      {
        path: 'no-permission',
        loadComponent: () => import('../error/no-permission.page'),
      },
    ],
  },
];
