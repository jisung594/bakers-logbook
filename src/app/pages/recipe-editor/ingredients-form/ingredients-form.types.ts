import { FormControl, FormGroup } from '@angular/forms';

export interface IngredientFormGroup {
  name: FormControl<string>;
  quantity: FormControl<string>;
  unit: FormControl<string>;
  isEditing: FormControl<boolean>;
}

// Each row is a FormGroup of above controls
export type IngredientRow = FormGroup<IngredientFormGroup>;
