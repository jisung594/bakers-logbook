import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from './header/header';
import { Recipe } from './pages/recipe/recipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  imports: [
    CommonModule,
    RouterModule,
    Header,
    Recipe,
  ],
})
export class App {
  protected readonly title = signal('bakers-logbook');
}
