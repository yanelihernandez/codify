import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private version = signal(0);

  constructor(private authService: AuthService) {}

  private getStorageKey(): string | null {
    const auth = this.authService.authState();
    return auth.loggedIn && auth.username ? `codify_favorites_${auth.username}` : null;
  }

  private touch(): void {
    this.version.update(v => v + 1);
  }

  favoritesVersion = this.version.asReadonly();

  getFavorites(): number[] {
    this.version();
    const key = this.getStorageKey();
    if (!key) return [];
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  isFavorite(professorId: number): boolean {
    return this.getFavorites().includes(Number(professorId));
  }

  addFavorite(professorId: number): void {
    const key = this.getStorageKey();
    if (!key) return;
    const favorites = this.getFavorites();
    const id = Number(professorId);
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem(key, JSON.stringify(favorites));
      this.touch();
    }
  }

  removeFavorite(professorId: number): void {
    const key = this.getStorageKey();
    if (!key) return;
    const id = Number(professorId);
    const favorites = this.getFavorites().filter(f => f !== id);
    localStorage.setItem(key, JSON.stringify(favorites));
    this.touch();
  }

  toggleFavorite(professorId: number): boolean {
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
