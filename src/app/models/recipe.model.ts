import { FirestoreDataConverter, DocumentData } from '@angular/fire/firestore';

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

// Firestore converter
export const recipeConverter: FirestoreDataConverter<Recipe> = {
  toFirestore(recipe: Recipe): DocumentData {
    return { ...recipe };
  },
  fromFirestore(snapshot, options): Recipe {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data['name'],
      ingredients: data['ingredients'],
      instructions: data['instructions'],
      createdAt: data['createdAt'],
      updatedAt: data['updatedAt'],
    };
  }
};