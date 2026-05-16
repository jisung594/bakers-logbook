import { authState, Auth, GoogleAuthProvider, signInWithPopup, signOut } from '@angular/fire/auth';
import {
  doc,
  docData,
  setDoc,
  updateDoc,
  Firestore,
  serverTimestamp,
} from '@angular/fire/firestore';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { UserProfile } from '../models/user-profile.model';
import { Injectable } from '@angular/core';
import { of, switchMap, Observable, BehaviorSubject } from 'rxjs';
import { ACCOUNTS } from '../config/accounts.config';
import { PREVIEW_AUTH } from '../config/preview-auth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState$: Observable<User | null>;
  userProfile$: Observable<UserProfile | null>;
  /** True when signed in via the DEMO button (preview account, read-only UI). */
  private isDemoMode$ = new BehaviorSubject<boolean>(
    localStorage.getItem('demoMode') === 'true',
  );
  public isDemoMode = this.isDemoMode$.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    this.authState$ = authState(this.auth);
    this.userProfile$ = this.authState$.pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }
        if (user.email === ACCOUNTS.devEmail) {
          this.clearPreviewMode();
        }
        const userRef = doc(this.firestore, `users/${user.uid}`);
        return docData(userRef) as Observable<UserProfile>;
      }),
    );
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  updateProfile(uid: string, data: UserProfile) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(
      userRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  async signUp(
    firstName: string,
    lastName: string,
    displayName: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = cred.user.uid;

      const userProfile: UserProfile = {
        uid,
        firstName,
        lastName,
        displayName,
        createdAt: serverTimestamp() as UserProfile['createdAt'],
      };

      const userDocRef = doc(this.firestore, 'users', uid);
      await setDoc(userDocRef, userProfile);
      this.clearPreviewMode();
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.clearPreviewMode();
      return result;
    } catch (err) {
      console.error('Sign-in failed:', err);
      throw err;
    }
  }

  /** Signs into the public preview account and enables read-only demo UI. */
  async signInAsDemo() {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        ACCOUNTS.previewEmail,
        PREVIEW_AUTH.password,
      );
      this.setPreviewMode();
      return result;
    } catch (err) {
      console.error('Preview sign-in failed:', err);
      throw err;
    }
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(this.auth, provider);
      this.clearPreviewMode();
      return result;
    } catch (err) {
      console.error('Google sign-in failed:', err);
      throw err;
    }
  }

  signOut() {
    this.clearPreviewMode();
    return signOut(this.auth);
  }

  async resetPassword(email: string) {
    try {
      return sendPasswordResetEmail(this.auth, email);
    } catch (err) {
      console.error('Password reset failed:', err);
      throw err;
    }
  }

  private setPreviewMode(): void {
    this.isDemoMode$.next(true);
    localStorage.setItem('demoMode', 'true');
  }

  private clearPreviewMode(): void {
    this.isDemoMode$.next(false);
    localStorage.removeItem('demoMode');
  }
}
