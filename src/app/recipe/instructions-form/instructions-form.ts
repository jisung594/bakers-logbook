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
    private receipeRepo: RecipeFirestoreService
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
    });
  }

  addInstruction() {
    this.instructions.push(this.createInstruction());
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  onSubmit() {
    console.log('Instructions submitted:', this.instructionsForm.value);
  }
}
