import { FormControl, FormGroup } from '@angular/forms';

export interface InstructionFormGroup {
  step: FormControl<string>;
  order: FormControl<number>;
  isEditing: FormControl<boolean>;
}

export type InstructionRow = FormGroup<InstructionFormGroup>;