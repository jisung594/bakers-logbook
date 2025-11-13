import { Injectable } from '@angular/core';
import { 
    addDoc, 
    collection,
    collectionData,
    // doc, 
    Firestore,
    // setDoc,
    serverTimestamp 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeFirestoreService {
  constructor(private firestore: Firestore) {}

  addRecipe(recipe: Recipe) {
    const recipesRef = collection(this.firestore, 'recipes');
    return addDoc(recipesRef, {
        recipe,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
  }

  getRecipes(): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, 'recipes');
    return collectionData(recipesRef, { idField: 'id' }) as Observable<Recipe[]>;
  }
}