import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { IngredientsForm } from './recipe/ingredients-form/ingredients-form';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  imports: [CommonModule, Header, IngredientsForm],
})
export class App {
  protected readonly title = signal('bakers-logbook');
}
