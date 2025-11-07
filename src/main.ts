import { bootstrapApplication } from '@angular/platform-browser';
// import { platformBrowser } from '@angular/platform-browser';
import { App } from './app/app';
import { AppModule } from './app/app-module';
import { importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';

// platformBrowser().bootstrapModule(AppModule, {
//   ngZoneEventCoalescing: true,
// })
//   .catch(err => console.error(err));

bootstrapApplication(App, {
  providers: [
    // importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideFirestore(() => getFirestore())
    // ),
  ],
});