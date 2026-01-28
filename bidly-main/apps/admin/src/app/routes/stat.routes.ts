import { Route } from '@angular/router';
import { StatisticsLayout } from '../pages/statistics/statistics.layout';

export const StatisticsRoutes: Route[] = [
  {
    path: 'statistics',
    component: StatisticsLayout,
    children: [
      {
        path: '',
        redirectTo: 'total-visit',
        pathMatch: 'full',
      },
      {
        path: 'popular-page',
        loadComponent: () =>
          import('../pages/statistics/popular-page/popular-page.page'),
      },
      {
        path: 'incoming-page',
        loadComponent: () =>
          import('../pages/statistics/incoming-page/incoming-page.page'),
      },
      {
        path: 'device-type',
        loadComponent: () =>
          import('../pages/statistics/device-type/device-type.page'),
      },
      {
        path: 'total-visit',
        loadComponent: () =>
          import('../pages/statistics/total-visit/total-visit.page'),
      },
    ],
  },
];
