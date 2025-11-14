import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private authService: AuthService) {}

  async handleGoogleSignIn() {
    try {
      const userCreds = await this.authService.signInWithGoogle();
      console.log("Logged in as", userCreds.user);
    } catch (err) {
      console.log("Login error:", err);
    }
  }
}
