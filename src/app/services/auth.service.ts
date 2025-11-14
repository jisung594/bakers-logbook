import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    // built-in Firebase function for handling signin via Google's popup window
    return signInWithPopup(this.auth, provider);
  }
}
