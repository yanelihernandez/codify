import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { FavoritesService } from '../../services/favorites.service';
import { LanguagesService } from '../../services/languages.service';
import { Language } from '../../models/language';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
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
    return currentUser?.profileImageUrl || this.defaultProfileImage;
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
      sessionStorage.setItem('redirectAfterLogin', '/profile');
      this.router.navigate(['/sign-in']);
    }
  }

  goToMyProfile(event: Event): void {
    event.preventDefault();
    this.menuOpen.set(false);
    this.router.navigate(['/profile']);
  }

  async logout(event: Event): Promise<void> {
    event.preventDefault();
    this.menuOpen.set(false);

    await this.authService.logout();
    this.user.set(null);

    this.favoritesService.clearForLogout();
    this.toastService.show('¡Hasta pronto! Has cerrado sesión');
    this.router.navigate(['/']);
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
