import { Component } from '@angular/core';
import { 
  FormArray, 
  FormBuilder,
  FormGroup, 
  ReactiveFormsModule, 
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecipeFirestoreService } from '../../services/recipe-firestore.service';

@Component({
  selector: 'app-ingredients-form',
  standalone: true,
  templateUrl: './ingredients-form.html',
  styleUrl: './ingredients-form.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class IngredientsForm {
  // NOTE: using FormBuilder w/ constructor is best-practice (?)
  // ingredientsForm = new FormGroup({
  //   name: new FormControl('', Validators.required),
  // });

  ingredientsForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private recipeRepo: RecipeFirestoreService
  ) {
    this.ingredientsForm = this.fb.group({
      name: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredient()]),
    });
  }

  // Returns typed reference to the FormArray
  get ingredients(): FormArray {
    return this.ingredientsForm.get('ingredients') as FormArray;
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
    if (this.ingredientsForm.valid) {
      try {
        await this.recipeRepo.addRecipe(this.ingredientsForm.value).then(() => {
          console.log('Recipe saved to Firestore.', this.ingredientsForm.value);
          this.ingredientsForm.reset();
          this.ingredients.clear();
          this.addIngredient(); // Adds one blank field (default form)
        }); 
      } catch (err) {
        console.error('Error saving recipe:', err);
      }
    }
  }
}
