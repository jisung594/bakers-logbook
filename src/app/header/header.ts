import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Login } from '../auth/login/login';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    Login, 
    CommonModule, 
    RouterModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // user$ = this.authService.authState$;
  user$!: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.authState$;
  }
}
