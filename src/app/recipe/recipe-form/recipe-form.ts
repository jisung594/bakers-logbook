import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientsForm } from './ingredients-form/ingredients-form';
import { InstructionsForm } from './instructions-form/instructions-form';
import { RecipeFirestoreService } from '../../services/recipe-firestore.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipe-form',
  imports: [
    CommonModule, 
    FormsModule, 
    IngredientsForm, 
    InstructionsForm
  ],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css'
})
export class RecipeForm {
  recipeName = {
    value: '',
    isEditing: true,
  };
  ingredients: any[] = [];
  instructions: any[] = [];

  constructor(private recipeRepo: RecipeFirestoreService) {}

  editRecipeName() {
    this.recipeName.isEditing = true;
  }

  saveRecipeName() {
    this.recipeName.isEditing = false;
  }




  // =============================================
  // (will) listen for changes in both child forms
  onIngredientsChange(ingredients: any[]) {
    this.ingredients = ingredients;
  }

  onInstructionsChange(instructions: any[]) {
    this.instructions = instructions;
  }
  // =============================================

  async saveRecipe() {
    // Exits if recipe name field is empty
    if (!this.recipeName.value.trim()) return;

    const newRecipe = {
      name: this.recipeName.value,
      ingredients: this.ingredients,
      instructions: this.instructions,
    }

    try {
      await this.recipeRepo.addRecipe(newRecipe);
      console.log('Recipe saved successfully:', newRecipe);
    } catch (err) {
      console.error('Error saving recipe:', err);
    }

  }
}
