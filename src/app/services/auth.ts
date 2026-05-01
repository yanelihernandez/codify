import { HttpClient } from '@angular/common/http';

import { Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import {Firestore, doc, setDoc, getDoc, updateDoc, query, collection, where, getDocs} from '@angular/fire/firestore';

export interface User {
  name: string;
  surnames: string;
  fullName: string;
  birthdate: string;
  username: string;
  email: string;
  moreInfo?: string;
  uid?: string;
  profileImageUrl?: string;
}

export interface AuthState {
  loggedIn: boolean;
  uid?: string;
  username?: string;
  fullName?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  authState = signal<AuthState>({ loggedIn: false });

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loadUserData(user);
      } else {
        this.authState.set({ loggedIn: false });
      }
    });
  }

  // Registrar usuario
  async registerUser(user: User, password: string): Promise<boolean> {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, user.email, password);

      const uid = cred.user.uid;

      await setDoc(doc(this.firestore, 'users', uid), {
        ...user
      });

      this.authState.set({
        loggedIn: true,
        uid,
        username: user.username,
        fullName: user.fullName
      });

      return true;

    } catch (error: any) {
      console.error('REGISTER ERROR:', error.code);
      console.error('REGISTER MSG:', error.message);
      return false;
    }
  }

  // Login
  async login(username: string, password: string): Promise<boolean> {
    try {
      const q = query(
        collection(this.firestore, 'users'),
        where('username', '==', username)
      );

      const snap = await getDocs(q);

      if (snap.empty) return false;

      const userData = snap.docs[0].data();
      const email = userData['email'];

      await signInWithEmailAndPassword(this.auth, email, password);

      return true;

    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // Logout
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.authState.set({ loggedIn: false });
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    const current = this.auth.currentUser;
    if (!current) return null;

    const snap = await getDoc(doc(this.firestore, 'users', current.uid));
    return snap.exists() ? snap.data() as User : null;
  }

  async getAuthUser(): Promise<FirebaseUser | null> {
    return this.auth.currentUser;
  }

  // Actualizar usuario
  async updateUser(updatedUser: User): Promise<boolean> {
    try {
      const current = this.auth.currentUser;
      if (!current) return false;

      await updateDoc(doc(this.firestore, 'users', current.uid), {
        ...updatedUser
      });

      return true;
    } catch {
      return false;
    }
  }

  // Cargar datos al iniciar sesión
  private async loadUserData(user: FirebaseUser) {
    const snap = await getDoc(doc(this.firestore, 'users', user.uid));

    if (snap.exists()) {
      const data = snap.data() as User;

      this.authState.set({
        loggedIn: true,
        uid: user.uid,
        username: data.username,
        fullName: data.fullName
      });
    }
  }
}


/*
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
    localStorage.removeItem(this.AUTH_KEY);
    this.authState.set({ loggedIn: false });
  }

  getUsers(): User[] {
    try {
      const raw = localStorage.getItem(this.USERS_KEY);
      return raw ? (JSON.parse(raw).users ?? []) : [];
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
            if (!users.some(u => u.username === user.username)) {
              users.push(user);
              this.saveUsers(users);
            }
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
*/
