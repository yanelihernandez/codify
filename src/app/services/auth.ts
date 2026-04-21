import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User {
  nombre: string;
  apellidos: string;
  fullName: string;
  fechaNacimiento: string;
  username: string;
  password: string;
  masInfo?: string;
}

export interface AuthState {
  loggedIn: boolean;
  username?: string;
  fullName?: string;
  nombre?: string;
  apellidos?: string;
  fechaNacimiento?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly USERS_KEY = 'codify_users';
  private readonly AUTH_KEY = 'codify_auth';

  authState = signal<AuthState>(this.loadAuth());

  constructor(private http: HttpClient) {}

  private loadAuth(): AuthState {
    try {
      const raw = localStorage.getItem(this.AUTH_KEY);
      return raw ? JSON.parse(raw) : { loggedIn: false };
    } catch {
      return { loggedIn: false };
    }
  }

  setAuth(state: AuthState): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(state));
    this.authState.set(state);
  }

  logout(): void {
    this.setAuth({ loggedIn: false });
  }

  getUsers(): User[] {
    try {
      const raw = localStorage.getItem(this.USERS_KEY);
      return raw ? JSON.parse(raw).users : [];
    } catch {
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify({ users }));
  }

  async findUser(username: string): Promise<User | null> {
    const localUsers = this.getUsers();
    const found = localUsers.find(u => u.username === username);
    if (found) return found;

    return new Promise(resolve => {
      this.http.get<{ users: User[] }>('data/users.json').subscribe({
        next: (data) => {
          const user = data.users.find(u => u.username === username);
          if (user) {
            const users = this.getUsers();
            users.push(user);
            this.saveUsers(users);
          }
          resolve(user ?? null);
        },
        error: () => resolve(null)
      });
    });
  }

  registerUser(user: User): boolean {
    const users = this.getUsers();
    if (users.some(u => u.username === user.username)) return false;
    users.push(user);
    this.saveUsers(users);
    return true;
  }

  updateUser(currentUsername: string, updatedUser: User): boolean {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.username === currentUsername);
    if (idx === -1) return false;
    if (!updatedUser.password) updatedUser.password = users[idx].password;
    users[idx] = updatedUser;
    this.saveUsers(users);
    return true;
  }

  getCurrentUser(): User | null {
    const auth = this.authState();
    if (!auth.loggedIn || !auth.username) return null;
    return this.getUsers().find(u => u.username === auth.username) ?? null;
  }
}
