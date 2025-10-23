import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),           //Hvata globalne JS greške
    provideZonelessChangeDetection(),              //Omogućava reaktivnu (zone-less) detekciju promena
    provideClientHydration(withEventReplay()),    //Povezuje SSR HTML sa klijentskim Angular-om (hydration) i čuva događaje tokom tog procesa
    provideHttpClient(withFetch()),                         //Omogućava HTTP pozive
    provideRouter(routes)                       //Aktivira routing sistem
  ]
};

// Konfiguracija aplikacije
