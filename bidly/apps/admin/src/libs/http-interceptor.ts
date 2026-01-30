import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { ToastService } from '@client-libs';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@common';
import { catchError, throwError } from 'rxjs';

export const HttpInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const toastService = inject(ToastService);

  if (isPlatformServer(platformId)) {
    return next(req);
  }

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  let request = req.clone({
    withCredentials: true,
  });

  if (!accessToken && !refreshToken) {
    return next(request).pipe(
      catchError((e) => {
        return throwError(() => e.error);
      }),
    );
  }

  const headers: { [key: string]: string } = {};

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (refreshToken) {
    headers['x-refresh-token'] = refreshToken;
  }

  request = req.clone({
    withCredentials: true,
    setHeaders: headers,
  });

  return next(request).pipe(
    catchError((e) => {
      if (e.status === 497) {
        toastService.error(e.error.message);
      }

      return throwError(() => e.error);
    }),
  );
};
