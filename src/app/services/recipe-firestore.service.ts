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

  addRecipe(uid: string, recipe: Recipe) {
    const recipesRef = this.getUserRecipesRef(uid);
    
    return addDoc(recipesRef, {
      ...recipe,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  getUserRecipesRef(uid: string) {
    return collection(this.firestore, `users/${uid}/recipes`);
  }

  getUserRecipes(uid: string): Observable<Recipe[]> {
    const recipesRef = this.getUserRecipesRef(uid);
    return collectionData(recipesRef, { idField: 'id' }) as Observable<Recipe[]>;
  }

//   getRecipes(): Observable<Recipe[]> {
//     const recipesRef = collection(this.firestore, 'recipes');
//     return collectionData(recipesRef, { idField: 'id' }) as Observable<Recipe[]>;
//   }
  
  updateRecipe(uid: string, recipeId: string, data: Partial<Recipe>) {
    const recipeDoc = doc(this.firestore, `users/${uid}/recipes/${recipeId}`);
    return updateDoc(recipeDoc, { 
        ...data, 
        updatedAt: new Date()
    });
  }
  
  // Returns promise of a snapshot (matching recipe doc)
  async getRecipeByName(uid: string, name: string): Promise<QuerySnapshot<Recipe>> {
    const recipesRef = this.getUserRecipesRef(uid).withConverter(recipeConverter);
    const q = query(recipesRef, where('name', '==', name));
    return getDocs(q);
  }
}