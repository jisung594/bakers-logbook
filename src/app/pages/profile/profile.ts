import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../../models/recipe.model';
import { AuthService } from '../../services/auth.service';
import { RecipeFirestoreService } from '../../services/recipe-firestore.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  // $ (syntax for observable)
  // ! (not initialized in constructor, but
  //   promises to assign value before accessed)
  recipes$!: Observable<Recipe[]>;

  constructor(
    private authService: AuthService,
    private firestoreService: RecipeFirestoreService
  ) {}

  // Called after input properties are set, but before DOM is ready
  async ngOnInIt() {
    const user = this.authService.getCurrentUser();

    if (user) {
      this.recipes$ = this.firestoreService.getUserRecipes(user.uid);
    }
  }
}
