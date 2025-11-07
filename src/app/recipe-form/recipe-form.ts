import { Component } from '@angular/core';
import { 
  FormArray, 
  FormBuilder,
  FormGroup, 
  ReactiveFormsModule, 
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecipeFirestoreService } from '../services/recipe-firestore.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class RecipeForm {
  // NOTE: using FormBuilder w/ constructor is best-practice (?)
  // recipeForm = new FormGroup({
  //   name: new FormControl('', Validators.required),
  // });

  recipeForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private recipeRepo: RecipeFirestoreService
  ) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredient()]),
    });
  }

  // Returns typed reference to the FormArray
  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      quantity: [''],
      unit: [''],
      name: ['', Validators.required],
    });
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  async onSubmit() {
    if (this.recipeForm.valid) {
      try {
        await this.recipeRepo.addRecipe(this.recipeForm.value).then(() => {
          console.log('Recipe saved to Firestore.', this.recipeForm.value);
          this.recipeForm.reset();
          this.ingredients.clear();
          this.addIngredient(); // Adds one blank field (default form)
        }); 
      } catch (err) {
        console.error('Error saving recipe:', err);
      }
    }
  }
}
