import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { IngredientsForm } from './recipe/recipe-form/ingredients-form/ingredients-form';
import { InstructionsForm } from './recipe/recipe-form/instructions-form/instructions-form';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  imports: [
    CommonModule, 
    Header, 
    IngredientsForm, 
    InstructionsForm
  ],
})
export class App {
  protected readonly title = signal('bakers-logbook');
}
