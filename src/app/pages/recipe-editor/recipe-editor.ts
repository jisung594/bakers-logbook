import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngredientsForm } from './ingredients-form/ingredients-form';
import { InstructionsForm } from './instructions-form/instructions-form';
import { AuthService } from '../../services/auth.service';
import { RecipeFirestoreService } from '../../services/recipe-firestore.service';
import { Recipe } from '../../models/recipe.model';
import { mapIngredientRows, mapInstructionRows } from './recipe.utils';
import { IngredientRow } from './ingredients-form/ingredients-form.types';
import { InstructionRow } from './instructions-form/instructions-form.types';

@Component({
  selector: 'app-recipe-editor',
  imports: [
    CommonModule, 
    FormsModule, 
    IngredientsForm, 
    InstructionsForm
  ],
  templateUrl: './recipe-editor.html',
  styleUrl: './recipe-editor.css'
})
export class RecipeEditor {
  // using @Input, instead of local vars, for parent component RecipeDetail 
  // to pass in initial ingredients/instructions data

  // Allows this component to be reused as form with CREATE, EDIT, and READ-ONLY modes
  @Input() ingredients: IngredientRow[] = [];
  @Input() instructions: InstructionRow[] = [];
  @Input() editable = true; // defaults as form (enabled/disabled from parent RecipeDetail, when applicable)
  // mode: 'view' | 'edit' = 'view';  // internal mode

  title = {
    value: '',
    isEditing: true,
  };
  currentRecipeId: string | null = null;

  constructor(
    private authService: AuthService,
    private recipeRepo: RecipeFirestoreService
  ) {}

  editTitle() {
    this.title.isEditing = true;
  }

  saveTitle() {
    this.title.isEditing = false;
  }

  // Runs when a IngredientsForm (child) emits an @Output
  onIngredientsChange(rows: IngredientRow[]) {
    this.ingredients = rows;
  }

  // Runs when a InstructionsForm (child) emits an @Output
  onInstructionsChange(rows: InstructionRow[]) {
    this.instructions = rows;
  }

  async saveRecipe() {
    // Requires at least a valid recipe title upon submit
    if (!this.title?.value) {
      console.warn("Recipe title is required before saving.");
      return;
    }

    const recipeData: Partial<Recipe> = {
      title: this.title.value,
      ingredients: mapIngredientRows(this.ingredients),
      instructions: mapInstructionRows(this.instructions),
      // updatedAt: new Date(),
    }
    // const recipeData = {
    //   title: this.title.value,
    //   ingredients: this.ingredients,
    //   instructions: this.instructions,
    //   updatedAt: new Date(),
    // }


    // ====================================
    const user = await this.authService.getCurrentUser();
    
    if (!user) {
      console.warn("You must be signed in to save recipes.");
      return;
    }
    // ====================================


    try {
      // Updates firestore doc directly if existing recipe
      if (this.currentRecipeId) {
        await this.recipeRepo.updateRecipe(
          user.uid, 
          this.currentRecipeId, 
          recipeData
        );
        console.log('Recipe updated successfully.')
        return;
      } 
      
      // Checks if recipe already exists by title
      // Note: ! asserts that title is non-null, since it's checked above (ie. if (!this.title?.value))
      const existingRecipeDoc = await this.recipeRepo.getRecipeByTitle(user.uid, recipeData.title!);

      // (if it does) Sets current id to that of found doc in firestore
      if (!existingRecipeDoc.empty) {
        this.currentRecipeId = existingRecipeDoc.docs[0].id;
        
        await this.recipeRepo.updateRecipe(
          user.uid,
          this.currentRecipeId, 
          recipeData
        );
        console.log('Existing recipe updated successfully.');
      } else {
        const newDocRef = await this.recipeRepo.addRecipe(user.uid, {
          ...recipeData,
          title: recipeData.title!, // Non-null assertion (safe, since it's checked above)
          ingredients: recipeData.ingredients ?? [],
          instructions: recipeData.instructions ?? [],
          createdAt: new Date(),
        });

        this.currentRecipeId = newDocRef.id;
        console.log('Recipe created successfully.');
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
    }
  }
}
