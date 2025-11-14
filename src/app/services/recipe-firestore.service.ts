import { Injectable } from '@angular/core';
import { 
    addDoc, 
    collection,
    collectionData,
    doc,
    Firestore,
    getDocs,
    query,
    QuerySnapshot,
    serverTimestamp,
    updateDoc,
    where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { recipeConverter } from '../models/recipe.model';

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
  
  updateRecipe(id: string, data: Partial<Recipe>) {
    const recipeDoc = doc(this.firestore, `recipes/${id}`);
    return updateDoc(recipeDoc, { ...data, updatedAt: new Date() });
  }
  
  // Returns promise of a snapshot (matching recipe doc)
  async getRecipeByName(name: string): Promise<QuerySnapshot<Recipe>> {
    const recipesRef = collection(this.firestore, 'recipes').withConverter(recipeConverter);
    const q = query(recipesRef, where('name', '==', name));
    return getDocs(q);
  }
}