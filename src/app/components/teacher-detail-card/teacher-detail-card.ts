import { Component, Input, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FavoritesService } from '../../services/favorites.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-teacher-detail-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './teacher-detail-card.html',
  styleUrl: './teacher-detail-card.css',
})
export class TeacherDetailCard {
  @Input() id: string | number = '';
  @Input() image_src = '';
  @Input() image_alt = 'Profesor';
  @Input() name = '';
  @Input() info = '';

  private authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  authState = this.authService.authState;

  isFavorite = computed(() => {
    this.favoritesService.favoritesVersion();
    return (
      this.authState().loggedIn &&
      this.favoritesService.isFavorite(String(this.id))
    );
  });

  async onFavoriteClick(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authState().loggedIn) {
      this.toastService.show('Debes iniciar sesión para guardar favoritos');
      sessionStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/sign-in']);
      return;
    }

    const liked = await this.favoritesService.toggleFavorite(String(this.id));

    this.toastService.show(
      liked ? 'Añadido a favoritos' : 'Eliminado de favoritos'
    );
  }
}
