import { Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from '@angular/fire/firestore';

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

export type RegisterResult =
  | { ok: true }
  | {
  ok: false;
  reason:
    | 'username-taken'
    | 'email-already-in-use'
    | 'weak-password'
    | 'invalid-email'
    | 'unknown';
};

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

  async registerUser(user: User, password: string): Promise<RegisterResult> {
    try {
      const usernameQuery = query(
        collection(this.firestore, 'users'),
        where('username', '==', user.username)
      );

      const usernameSnap = await getDocs(usernameQuery);

      if (!usernameSnap.empty) {
        return { ok: false, reason: 'username-taken' };
      }

      const cred = await createUserWithEmailAndPassword(
        this.auth,
        user.email,
        password
      );

      const uid = cred.user.uid;

      await setDoc(doc(this.firestore, 'users', uid), {
        ...user,
        uid,
      });

      await signOut(this.auth);
      this.authState.set({ loggedIn: false });

      return { ok: true };
    } catch (error: any) {
      console.error('REGISTER ERROR:', error.code);
      console.error('REGISTER MSG:', error.message);

      if (error.code === 'auth/email-already-in-use') {
        return { ok: false, reason: 'email-already-in-use' };
      }

      if (error.code === 'auth/weak-password') {
        return { ok: false, reason: 'weak-password' };
      }

      if (error.code === 'auth/invalid-email') {
        return { ok: false, reason: 'invalid-email' };
      }

      return { ok: false, reason: 'unknown' };
    }
  }

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
      console.error('LOGIN ERROR:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.authState.set({ loggedIn: false });
  }

  async getCurrentUser(): Promise<User | null> {
    const current = this.auth.currentUser;
    if (!current) return null;

    const snap = await getDoc(doc(this.firestore, 'users', current.uid));
    return snap.exists() ? (snap.data() as User) : null;
  }

  async getAuthUser(): Promise<FirebaseUser | null> {
    return this.auth.currentUser;
  }

  async updateUser(updatedUser: User): Promise<boolean> {
    try {
      const current = this.auth.currentUser;
      if (!current) return false;

      await updateDoc(doc(this.firestore, 'users', current.uid), {
        ...updatedUser,
      });

      return true;
    } catch (error) {
      console.error('UPDATE USER ERROR:', error);
      return false;
    }
  }

  private async loadUserData(user: FirebaseUser): Promise<void> {
    const snap = await getDoc(doc(this.firestore, 'users', user.uid));

    if (snap.exists()) {
      const data = snap.data() as User;

      this.authState.set({
        loggedIn: true,
        uid: user.uid,
        username: data.username,
        fullName: data.fullName,
      });
    }
  }

  isAuthReady(): Promise<boolean> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        unsubscribe();

        if (user) {
          await this.loadUserData(user);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
