import { Component, EventEmitter, Output } from '@angular/core';
import { 
  FormArray, 
  FormBuilder,
  FormGroup, 
  ReactiveFormsModule, 
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecipeFirestoreService } from '../../../services/recipe-firestore.service';

@Component({
  selector: 'app-ingredients-form',
  standalone: true,
  templateUrl: './ingredients-form.html',
  styleUrl: './ingredients-form.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class IngredientsForm {
  @Output() ingredientsChange = new EventEmitter<any[]>();

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
      isEditing: [true] // tracks edit/display mode
    });
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  editIngredient(index: number) {
    const item = this.ingredients.at(index);
    item.patchValue({ isEditing: true });
  }

  saveIngredient(index: number) {
    const ingredient = this.ingredients.at(index);
    ingredient.patchValue({ isEditing: false });

    // Notifies parent
    this.emitChange();
  }

  emitChange() {
    this.ingredientsChange.emit(this.ingredientsForm.value.ingredients);
  }

  // async onSubmit() {
  //   if (this.ingredientsForm.valid) {
  //     try {
  //       await this.recipeRepo.addRecipe(this.ingredientsForm.value).then(() => {
  //         console.log('Recipe saved to Firestore.', this.ingredientsForm.value);
  //         this.ingredientsForm.reset();
  //         this.ingredients.clear();
  //         this.addIngredient(); // Adds one blank field (default form)
  //       }); 
  //     } catch (err) {
  //       console.error('Error saving recipe:', err);
  //     }
  //   }
  // }
}
