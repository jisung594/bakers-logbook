import { Injectable } from '@angular/core';
import { 
    Firestore, 
    collection, 
    addDoc, 
    doc, 
    setDoc, 
    collectionData 
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
    return addDoc(recipesRef, recipe);
  }

  getRecipes(): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, 'recipes');
    return collectionData(recipesRef, { idField: 'id' }) as Observable<Recipe[]>;
  }



  saveStep(recipe: Recipe) {
    const recipesRef = collection(this.firestore, 'recipes');


    console.log(this.getRecipes());

    // return updateDoc(docRef, instruction);


    // TODO: Add if/else here for creating new doc or updating existing one
    return addDoc(recipesRef, recipe);
  }



}