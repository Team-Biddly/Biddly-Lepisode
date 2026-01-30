import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { ToastService } from '@client-libs';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@common';

export const HttpInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  const platformId = inject(PLATFORM_ID);

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    return next(req);
  }

  const request = req.clone({
    setHeaders: {
      authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  if (isPlatformServer(platformId)) {
    return next(req);
  }

  return next(request).pipe(
    catchError((error) => {
      if (error.status === 498) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        router.navigateByUrl('/login', { replaceUrl: true });
      }

      if (error.status === 500 || error.status === 0) {
        toast.error('서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        return Promise.reject('');
      }

      if (!error.error.message) {
        toast.error(JSON.parse(error.error).message);
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }),
  );
};
