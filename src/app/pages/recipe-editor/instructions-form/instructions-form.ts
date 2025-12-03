import { Component, EventEmitter, Input, Output } from '@angular/core';
import { 
  FormArray, 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecipeFirestoreService } from '../../../services/recipe-firestore.service';
import { Instruction } from '../../../models/recipe.model';
import { InstructionRow } from './instructions-form.types';

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
  @Input() initialInstructions: InstructionRow[] = [];
  @Input() editable = true;
  @Output() instructionsChange = new EventEmitter<InstructionRow[]>();

  instructionsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private recipeRepo: RecipeFirestoreService
  ) {
    this.instructionsForm = this.fb.group({
      instructions: this.fb.array([this.createInstruction(1)]) // starts first step in order at 1
    })
  }

  get instructions(): FormArray<InstructionRow> {
    return this.instructionsForm.get('instructions') as FormArray<InstructionRow>;
  }

  // createInstruction(order: number): FormGroup {
  //   return this.fb.group({
  //     step: ['', Validators.required],
  //     order: [order],
  //     isEditing: [true] // tracks edit/display mode
  //   });
  // }

  createInstruction(order: number): InstructionRow {
    return this.fb.group({
      step: this.fb.control('', { nonNullable: true }),
      order: this.fb.control(order, { nonNullable: true }),
      isEditing: this.fb.control(true, { nonNullable: true }),
    });
  }

  addInstruction(): void {
    const instructionsArray = this.instructions;
    const nextOrder = instructionsArray.length + 1;

    this.instructions.push(this.createInstruction(nextOrder));
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
    // this.instructionsChange.emit(this.instructionsForm.value.instructions);
    this.instructionsChange.emit(this.instructions.controls as InstructionRow[]);
    // this.instructionsChange.emit(this.instructionsForm.value.instructions as Instruction[]);
  }
}
