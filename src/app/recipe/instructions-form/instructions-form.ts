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
  selector: 'app-instructions-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './instructions-form.html',
  styleUrl: './instructions-form.css'
})
export class InstructionsForm {
  instructionsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private recipeRepo: RecipeFirestoreService
  ) {
    this.instructionsForm = this.fb.group({
      instructions: this.fb.array([this.createInstruction()])
    })
  }

  get instructions(): FormArray {
    return this.instructionsForm.get('instructions') as FormArray;
  }

  createInstruction(): FormGroup {
    return this.fb.group({
      step: ['', Validators.required],
      isEditing: [true] // tracks edit/display mode
    });
  }

  addInstruction() {
    this.instructions.push(this.createInstruction());
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  editInstruction(index: number) {
    const item = this.instructions.at(index);
    item.patchValue({ isEditing: true });
  }

  async saveInstruction(index: number) {
  // async onSubmit() {
    if (this.instructionsForm.valid) {
      try {

        // TODO: Update when inline-editing is ready

        this.recipeRepo.addStep(this.instructionsForm.value).then(() => {
        // await this.recipeRepo.addStep(this.instructionsForm.value).then(() => {
          console.log('Step saved to Firestore.', this.instructionsForm.value);
          this.instructionsForm.reset();
          this.instructions.clear();
          this.addInstruction(); // Adds one blank field (default form)
        }); 
      } catch (err) {
        console.error('Error saving recipe:', err);
      }
    }
  }
}
