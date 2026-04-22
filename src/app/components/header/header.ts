import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { FavoritesService } from '../../services/favorites.service';

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

  authState = this.authService.authState;
  menuOpen = signal(false);
  displayName = computed(() => this.authState().fullName || this.authState().username || 'Invitado');

  goToProfile(event: Event): void {
    event.preventDefault();
    if (this.authState().loggedIn) {
      this.menuOpen.update(v => !v);
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

  logout(event: Event): void {
    event.preventDefault();
    this.menuOpen.set(false);
    this.authService.logout();
    this.favoritesService.clearForLogout();
    this.toastService.show('¡Hasta pronto! Has cerrado sesión');
    this.router.navigate(['/']);
  }
}
