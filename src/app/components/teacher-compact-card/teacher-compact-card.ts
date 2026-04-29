import { Component, Input, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FavoritesService } from '../../services/favorites.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-teacher-compact-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './teacher-compact-card.html',
  styleUrl: './teacher-compact-card.css',
})
export class TeacherCompactCardComponent {
  @Input() image_alt = 'image';
  @Input() image_src = 'images/perfil.jpg';
  @Input() name = 'Best Professor';
  @Input() speciality = 'Speciality';
  @Input() stars = 0;
  @Input() id = 0;

  private authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  authState = this.authService.authState;
  isFavorite = computed(() => {
    this.favoritesService.favoritesVersion();
    return this.authState().loggedIn && this.favoritesService.isFavorite(this.id);
  });

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    if (!this.authState().loggedIn) {
      this.toastService.show('Debes iniciar sesión para guardar favoritos');
      sessionStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/sign-in']);
      return;
    }

    const liked = this.favoritesService.toggleFavorite(this.id);
    this.toastService.show(liked ? 'Añadido a favoritos' : 'Eliminado de favoritos');
  }
}
