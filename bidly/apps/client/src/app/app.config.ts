import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { appRoutes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiModule } from '@api-client';
import { environment } from '../environments/environment';
import { provideToastr } from 'ngx-toastr';
import { HttpInterceptor } from '../libs/http-interceptor';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { GLOBAL_AUTO_ANIMATE_OPTIONS } from 'ng-auto-animate';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([HttpInterceptor])),
    provideToastr(),
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      ApiModule.forRoot({
        rootUrl: environment.baseUrl,
      }),
    ),
    {
      provide: GLOBAL_AUTO_ANIMATE_OPTIONS,
      useValue: {
        duration: 250,
        easing: 'ease-in-out',
      },
    },
  ],
};
