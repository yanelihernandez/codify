import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth';
import { LanguagesService } from '../../services/language.service';
import { Language } from '../../models/language';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    IonContent,
    IonButton
  ]
})
export class HomePage {
  private authService = inject(AuthService);
  private languagesService = inject(LanguagesService);
  private router = inject(Router);

  authState = this.authService.authState;
  languages = signal<Language[]>([]);

  username = computed(() => {
    const auth = this.authState();
    return auth.loggedIn ? (auth.fullName || auth.username || 'Usuario') : '';
  });

  constructor() {
    this.loadLanguages();
  }

  private loadLanguages(): void {
    this.languagesService.getLanguages().subscribe(data => {
      this.languages.set(data);
    });
  }

  goToLogin() {
    this.router.navigate(['/sign-in']);
  }

  goToRegister() {
    this.router.navigate(['/sign-up']);
  }

  goToLanguage(slug: string) {
    this.router.navigate(['/teacher-list', slug]);
  }
}
