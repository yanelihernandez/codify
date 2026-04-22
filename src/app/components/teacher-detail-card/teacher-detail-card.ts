import { Component, Input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-teacher-detail-card',
  imports: [RouterLink],
  templateUrl: './teacher-detail-card.html',
  styleUrl: './teacher-detail-card.css'
})
export class TeacherDetailCard {
  @Input() id!: number;
  @Input() name!: string;
  @Input() info!: string;
  @Input() image_src!: string;
  @Input() image_alt!: string;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  authState() {
    return this.authService.authState();
  }

  private favoritesKey(): string | null {
    const auth = this.authService.authState();
    if (!auth.loggedIn || !auth.username) return null;
    return `favorites_${auth.username}`;
  }

  isFavorite(): boolean {
    const key = this.favoritesKey();
    if (!key) return false;

    const raw = localStorage.getItem(key);
    const favorites: number[] = raw ? JSON.parse(raw) : [];
    return favorites.includes(this.id);
  }

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const auth = this.authService.authState();

    if (!auth.loggedIn || !auth.username) {
      this.toastService.show('Inicia sesión para guardar favoritos');
      sessionStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/sign-in']);
      return;
    }

    const key = this.favoritesKey();
    if (!key) return;

    const raw = localStorage.getItem(key);
    const favorites: number[] = raw ? JSON.parse(raw) : [];

    const exists = favorites.includes(this.id);
    const updated = exists
      ? favorites.filter((favId) => favId !== this.id)
      : [...favorites, this.id];

    localStorage.setItem(key, JSON.stringify(updated));

    this.toastService.show(
      exists ? 'Eliminado de favoritos' : 'Añadido a favoritos'
    );
  }
}
