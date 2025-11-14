import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      // built-in Firebase function for handling signin via Google's popup window
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error) {
      console.error("Google sign-in failed:", error);
      throw error; 
    }
  }
}
