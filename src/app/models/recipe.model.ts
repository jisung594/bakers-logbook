export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  isEditing?: boolean;
}

export interface Instruction {
  step: string;
  order: number;
  isEditing?: boolean;
}

// recipe document structure (saved to Firestore)
export interface Recipe {
  id?: string; // Firestore auto-generated ID
  name: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  createdAt?: any;
  updatedAt?: any;
}