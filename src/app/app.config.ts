import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { DropdownModule, SidebarModule } from '@coreui/angular';
import { freeSet } from '@coreui/icons';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(SidebarModule, DropdownModule),

    // 👇 Aquí se inicializan los íconos directamente SIN main.ts
    {
      provide: IconSetService,
      useFactory: () => {
        const icons = new IconSetService();
        icons.icons = { ...freeSet };
        return icons;
      }
    },

    provideAnimationsAsync(),
    provideHttpClient(),
  ]
};
