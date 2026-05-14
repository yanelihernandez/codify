import { Injectable, signal } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from './auth';

interface FavoriteDoc {
  id: string;
  userId: string;
  professorId: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService2 {
  private favorites = signal<string[]>([]);
  favoritesVersion = this.favorites.asReadonly();

  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  loadFavoritesForCurrentUser(): void {
    const auth = this.authService.authState();

    if (!auth.loggedIn || !auth.uid) {
      this.favorites.set([]);
      return;
    }

    this.sub?.unsubscribe();

    const ref = collection(this.firestore, 'favorites');
    const q = query(ref, where('userId', '==', auth.uid));

    this.sub = (collectionData(q, { idField: 'id' }) as any).subscribe({
      next: (docs: FavoriteDoc[]) => {
        this.favorites.set(docs.map((fav) => String(fav.professorId)));
      },
      error: (error: unknown) => {
        console.error('Error cargando favoritos:', error);
        this.favorites.set([]);
      },
    });
  }

  getFavorites(): string[] {
    return this.favorites();
  }

  isFavorite(professorId: string | number): boolean {
    return this.favorites().includes(String(professorId));
  }

  async toggleFavorite(professorId: string | number): Promise<boolean> {
    const auth = this.authService.authState();

    if (!auth.loggedIn || !auth.uid) {
      return false;
    }

    const id = String(professorId);
    const currentFavorites = this.favorites();

    const ref = collection(this.firestore, 'favorites');
    const q = query(
      ref,
      where('userId', '==', auth.uid),
      where('professorId', '==', id)
    );

    if (currentFavorites.includes(id)) {
      this.favorites.set(currentFavorites.filter((favId) => favId !== id));

      const snap = await getDocs(q);

      await Promise.all(
        snap.docs.map((favoriteDoc) =>
          deleteDoc(doc(this.firestore, `favorites/${favoriteDoc.id}`))
        )
      );

      return false;
    }

    this.favorites.set([...currentFavorites, id]);

    await addDoc(ref, {
      userId: auth.uid,
      professorId: id,
      createdAt: new Date().toISOString(),
    });

    return true;
  }

  clearForLogout(): void {
    this.favorites.set([]);
    this.sub?.unsubscribe();
  }
}
