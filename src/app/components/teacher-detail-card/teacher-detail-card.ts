import { Component, Input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-teacher-detail-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './teacher-detail-card.html',
  styleUrl: './teacher-detail-card.css'
})
export class TeacherDetailCard {
  @Input() id!: string | number;
  @Input() name!: string;
  @Input() info!: string;
  @Input() image_src!: string;
  @Input() image_alt!: string;

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private toastService: ToastService,
    private router: Router
  ) {}

  authState() {
    return this.authService.authState();
  }

  isFavorite(): boolean {
    return this.authState().loggedIn && this.favoritesService.isFavorite(this.id);
  }

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authState().loggedIn) {
      this.toastService.show('Inicia sesión para guardar favoritos');
      sessionStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/sign-in']);
      return;
    }

    const liked = this.favoritesService.toggleFavorite(this.id);
    this.toastService.show(liked ? 'Añadido a favoritos' : 'Eliminado de favoritos');
  }
}
