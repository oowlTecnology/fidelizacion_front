import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';

import { routes } from './app.routes';
import { AuthStateClass } from './store/states/auth.state';
import { UsersStateClass } from './store/states/users.state';
import { DashboardStateClass } from './store/states/dashboard.state';
import { STORE_CONFIG } from './store/store.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      NgxsModule.forRoot([
        AuthStateClass,
        UsersStateClass,
        DashboardStateClass
      ], STORE_CONFIG),
      NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: false
      }),
      NgxsLoggerPluginModule.forRoot({
        disabled: false
      }),
      NgxsRouterPluginModule.forRoot()
    )
  ]
};
