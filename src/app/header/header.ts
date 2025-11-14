import { Component } from '@angular/core';
import { Login } from '../auth/login/login';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Login],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
