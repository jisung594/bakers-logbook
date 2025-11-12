import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { RecipeForm } from './recipe/recipe-form/recipe-form';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  imports: [
    CommonModule, 
    Header,
    RecipeForm,
  ],
})
export class App {
  protected readonly title = signal('bakers-logbook');
}
