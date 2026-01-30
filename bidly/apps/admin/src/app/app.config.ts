import { registerLocaleData } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import localeKo from '@angular/common/locales/ko';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from '@angular/router';
import { ApiModule } from '@api-client';
import { provideToastr } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { HttpInterceptor } from '../libs/http-interceptor';
import { appRoutes } from './app.routes';

registerLocaleData(localeKo, 'ko-KR');

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'ko-KR',
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withViewTransitions()),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(withFetch(), withInterceptors([HttpInterceptor])),
    importProvidersFrom(
      ApiModule.forRoot({
        rootUrl: environment.baseUrl,
      }),
    ),
  ],
};
