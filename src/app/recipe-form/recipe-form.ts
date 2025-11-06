import { Component } from '@angular/core';
import { 
  FormArray, 
  FormBuilder, 
  FormControl, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredient()]),
    });
  }

  // Returns typed reference to the FormArray
  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  createIngredient(): FormControl {
    return this.fb.control('', Validators.required);
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onSubmit() {
    console.log('Form submitted!', this.recipeForm.value);
    // TODO: send data here to a service or API
  }
}
