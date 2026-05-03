import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp({
      projectId: "codify-pwm-2026",
      appId: "1:1041408943136:web:79681622c3db0402d3c845",
      storageBucket: "codify-pwm-2026.firebasestorage.app",
      apiKey: "AIzaSyDcGF9HCbzUgRhFzT9eyLe63-CI8OK_4TQ",
      authDomain: "codify-pwm-2026.firebaseapp.com",
      messagingSenderId: "1041408943136"
      })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
