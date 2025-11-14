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
  currentRecipeId: string | null = null;

  constructor(private recipeRepo: RecipeFirestoreService) {}

  editRecipeName() {
    this.recipeName.isEditing = true;
  }

  saveRecipeName() {
    this.recipeName.isEditing = false;
  }

  onIngredientsChange(ingredients: any[]) {
    this.ingredients = ingredients;
  }

  onInstructionsChange(instructions: any[]) {
    this.instructions = instructions;
  }

  async saveRecipe() {
    // Requires at least a valid recipe name upon submit
    if (this.recipeName) {
      const recipeData = {
        name: this.recipeName.value,
        ingredients: this.ingredients,
        instructions: this.instructions,
        updatedAt: new Date(),
      }

      try {
        // Updates firestore doc directly if existing recipe
        if (this.currentRecipeId) {
          await this.recipeRepo.updateRecipe(this.currentRecipeId, recipeData);
          console.log('Recipe updated successfully.')
          return;
        } 
        

        // Checks if recipe already exists by name
        const existingRecipeDoc = await this.recipeRepo.getRecipeByName(recipeData.name);

        // (if it does) Sets current id to that of found doc in firestore
        if (!existingRecipeDoc.empty) {
          this.currentRecipeId = existingRecipeDoc.docs[0].id;
          await this.recipeRepo.updateRecipe(this.currentRecipeId, recipeData);
          console.log('Existing recipe updated successfully.');
        } else {
          const newDocRef = await this.recipeRepo.addRecipe({
            ...recipeData, 
            createdAt: new Date(),
          });

          this.currentRecipeId = newDocRef.id;
          console.log('Recipe created successfully.');
        }

        

      } catch (err) {
        console.error('Error saving recipe:', err);
      }
    } else {
      console.warn('Recipe name is required before saving.');
    }
  }
}
