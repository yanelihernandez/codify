import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private version = signal(0);
  favoritesVersion = this.version.asReadonly();

  constructor(private authService: AuthService) {}

  private getStorageKey(): string | null {
    const auth = this.authService.authState();
    return auth.loggedIn && auth.username
      ? `codify_favorites_${auth.username}`
      : null;
  }

  private normalizeId(professorId: string | number): string {
    return String(professorId);
  }

  private touch(): void {
    this.version.update(v => v + 1);
  }

  getFavorites(): string[] {
    this.version();

    const key = this.getStorageKey();
    if (!key) return [];

    try {
      const raw = localStorage.getItem(key);
      const favorites = raw ? JSON.parse(raw) : [];
      return Array.isArray(favorites) ? favorites.map(String) : [];
    } catch {
      return [];
    }
  }

  isFavorite(professorId: string | number): boolean {
    const id = this.normalizeId(professorId);
    return this.getFavorites().includes(id);
  }

  addFavorite(professorId: string | number): void {
    const key = this.getStorageKey();
    if (!key) return;

    const id = this.normalizeId(professorId);
    const favorites = this.getFavorites();

    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem(key, JSON.stringify(favorites));
      this.touch();
    }
  }

  removeFavorite(professorId: string | number): void {
    const key = this.getStorageKey();
    if (!key) return;

    const id = this.normalizeId(professorId);
    const favorites = this.getFavorites().filter(favId => favId !== id);

    localStorage.setItem(key, JSON.stringify(favorites));
    this.touch();
  }

  toggleFavorite(professorId: string | number): boolean {
    const liked = this.isFavorite(professorId);

    if (liked) {
      this.removeFavorite(professorId);
      return false;
    }

    this.addFavorite(professorId);
    return true;
  }

  clearForLogout(): void {
    this.touch();
  }
}
