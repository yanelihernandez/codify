import {Injectable, signal} from "@angular/core";
import {Subscription} from "rxjs";
import {AuthService} from "./auth";
import {CapacitorSQLite, SQLiteConnection, SQLiteDBConnection} from "@capacitor-community/sqlite";

interface FavoriteDoc {
  id: string;
  userId: string;
  professorId: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favorites = signal<string[]>([]);
  favoritesVersion = this.favorites.asReadonly();

  private sub?: Subscription;

  private sqlite: SQLiteConnection;
  private db!: SQLiteDBConnection;
  private initialized: Promise<void>;

  constructor(
    private authService: AuthService,
  ) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.initialized = this.init();
  }

  private async init() {
    try{
      console.log('1 createConnection');
      const db = await this.sqlite.createConnection(
        "favorites", false, 'no-encryption', 1, false
      );

      console.log('2 open');
      await db.open();

      console.log('3 assign');
      this.db = db;

      console.log('4 create table');
      await db.execute(`
        CREATE TABLE IF NOT EXISTS favorites (
            userId TEXT,
            teacherId TEXT,
            createdAt TEXT,
            PRIMARY KEY (userId, teacherId)
          );
        `)

      console.log('5 done');

    } catch (error) {
      console.error('SQLITE INIT ERROR:', error);
      throw error;
    }
  }

  async loadFavoritesForCurrentUser(): Promise<void> {
    await this.initialized;

    const auth = this.authService.authState();

    if (!auth.loggedIn || !auth.uid) {
      this.favorites.set([]);
      return;
    }

    try {
      const result = await this.db.query(
        'SELECT teacherId FROM favorites WHERE userId = ?',
        [auth.uid]
      );

      const favorites = result.values?.map(
        (fav: any) => String(fav.teacherId)
      ) ?? [];

      this.favorites.set(favorites);

    } catch (error) {
      console.error('Error cargando favoritos:', error);
      this.favorites.set([]);
    }
  }

  getFavorites(): string[] {
    return this.favorites();
  }

  isFavorite(professorId: string | number): boolean {
    return this.favorites().includes(String(professorId));
  }

  async toggleFavorite(professorId: string | number): Promise<boolean> {

    await this.initialized;

    const auth = this.authService.authState();

    if (!auth.loggedIn || !auth.uid) {
      return false;
    }

    const id = String(professorId);

    try {

      // Comprobar si ya existe
      const result = await this.db.query(
        `
      SELECT * FROM favorites
      WHERE userId = ?
      AND teacherId = ?
      `,
        [auth.uid, id]
      );

      const exists = (result.values?.length ?? 0) > 0;

      // Si existe -> borrar
      if (exists) {

        await this.db.run(
          `
        DELETE FROM favorites
        WHERE userId = ?
        AND teacherId = ?
        `,
          [auth.uid, id]
        );

        const check = await this.db.query(
          `SELECT * FROM favorites`
        );
        console.log(check.values);

        this.favorites.update((favs) =>
          favs.filter((favId) => favId !== id)
        );

        return false;
      }

      // Si no existe -> insertar
      await this.db.run(
        `
      INSERT INTO favorites (
        userId,
        teacherId,
        createdAt
      )
      VALUES (?, ?, ?)
      `,
        [auth.uid, id, new Date().toISOString()]
      );

      const check = await this.db.query(
        `SELECT * FROM favorites`
      );
      console.log(check.values);

      this.favorites.update((favs) => [...favs, id]);

      return true;

    } catch (error) {
      console.error('Error en toggle favorite:', error);
      return false;
    }
  }

  clearForLogout(): void {
    this.favorites.set([]);
    this.sub?.unsubscribe();
  }
}
