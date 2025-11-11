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
  selector: 'app-instructions-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './instructions-form.html',
  styleUrl: './instructions-form.css'
})
export class InstructionsForm {
  @Output() instructionsChange = new EventEmitter<any[]>();

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

  saveInstruction(index: number) {
    const instruction = this.instructions.at(index);
    instruction.patchValue({ isEditing: false });

    // Notifies parent
    this.emitChange();
  }

  // Emits change to instructions for RecipeForm (parent) to handle
  emitChange() {
    this.instructionsChange.emit(this.instructionsForm.value.instructions);
  }

  // async saveInstruction(index: number) {
  //   if (this.instructionsForm.valid) {
  //     try {
  //       this.recipeRepo.saveStep(this.instructionsForm.value).then(() => {
  //       // await this.recipeRepo.addStep(this.instructionsForm.value).then(() => {
  //         console.log('Step saved to Firestore.', this.instructionsForm.value);

  //         const item = this.instructions.at(index);
  //         item.patchValue({ isEditing: false });
  //       }); 
  //     } catch (err) {
  //       console.error('Error saving recipe:', err);
  //     }
  //   }
  // }
}
