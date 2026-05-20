import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { FavoritesService } from '../../services/favorites-sqlite';
import { LanguagesService } from '../../services/language.service';
import { Language } from '../../models/language';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private languagesService = inject(LanguagesService);

  authState = this.authService.authState;
  menuOpen = signal(false);
  user = signal<User | null>(null);
  languages = signal<Language[]>([]);
  mobileMenuOpen = signal(false);

  defaultProfileImage =
    'https://res.cloudinary.com/dcqaw1j7r/image/upload/v1777657390/perfil_pgak1f.jpg';

  displayName = computed(() =>
    this.authState().fullName || this.authState().username || 'Invitado'
  );

  headerProfileImage = computed(() => {
    const currentUser = this.user();
    const url = currentUser?.profileImageUrl;
    if (!url || url.includes('logo_verde_el93m0.png')) {
      return this.defaultProfileImage;
    }
    return url;
  });

  constructor() {
    this.loadUserForHeader();
    this.loadLanguages();
  }

  private async loadUserForHeader(): Promise<void> {
    const isLogged = await this.authService.isAuthReady();

    if (!isLogged) {
      this.user.set(null);
      return;
    }

    const currentUser = await this.authService.getCurrentUser();
    this.user.set(currentUser);
  }

  goToProfile(event: Event): void {
    event.preventDefault();

    if (this.authState().loggedIn) {
      this.menuOpen.update(v => !v);
      this.loadUserForHeader();
    } else {
      this.toastService.show('Debes iniciar sesión para acceder a tu perfil');
      sessionStorage.setItem('redirectAfterLogin', '/teacher-list/python');
      this.router.navigate(['/sign-in']);
    }
  }

  goToMyProfile(event: Event): void {
    event.preventDefault();
    this.menuOpen.set(false);
    this.toastService.show('Perfil de usuario (Próximamente)');
  }

  async logout(event: Event): Promise<void> {
    event.preventDefault();
    this.menuOpen.set(false);

    await this.authService.logout();
    this.user.set(null);

    this.favoritesService.clearForLogout();
    this.toastService.show('¡Hasta pronto! Has cerrado sesión');
    this.router.navigate(['/sign-in']);
  }

  private loadLanguages(): void {
    this.languagesService.getLanguages().subscribe(data => {
      this.languages.set(data);
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }
}
