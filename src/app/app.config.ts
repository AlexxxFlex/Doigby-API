import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);


import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    {provide: LOCALE_ID, useValue: 'fr-FR' },
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      })),
    provideHttpClient()
  ]
};
