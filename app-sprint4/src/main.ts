import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment'; // Asegúrate de haber copiado este archivo

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { getStorage, provideStorage } from '@angular/fire/storage';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Inyectamos Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "codify-pwm-2026", appId: "1:1041408943136:web:318b4a865163df5ed3c845", storageBucket: "codify-pwm-2026.firebasestorage.app", apiKey: "AIzaSyDcGF9HCbzUgRhFzT9eyLe63-CI8OK_4TQ", authDomain: "codify-pwm-2026.firebaseapp.com", messagingSenderId: "1041408943136" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage()),
  ],
});
