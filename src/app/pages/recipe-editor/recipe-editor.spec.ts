import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeEditor } from './recipe-editor.ts';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { RecipeFacadeService } from '../../features/recipes/services/recipe.facade';
import { AuthFacadeService } from '../../features/auth/services/auth.facade';
import { AppFacadeService } from '../../features/app/services/app.facade';

// Mock the fetch function
window.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({}),
});

// Mock services
class MockRouter {
  navigate = jest.fn();
}

class MockRecipeFacadeService {
  isLoading$ = of(false);
  isEditing$ = of(false);
  isSyncing$ = of(false);
  hasError$ = of(false);
  status$ = of({ status: 'idle' });
  saveRecipe = jest.fn().mockResolvedValue('mock-id');
  updateRecipe = jest.fn().mockResolvedValue(undefined);
  deleteRecipe = jest.fn().mockResolvedValue(undefined);
}

class MockAuthFacadeService {
  isDemoMode$ = of(false);
  authState$ = of(null);
  userProfile$ = of(null);
}

class MockAppFacadeService {
  log = jest.fn();
  logError = jest.fn();
  logEvent = jest.fn();
}

describe('RecipeEditor', () => {
    let component: RecipeEditor;
    let fixture: ComponentFixture<RecipeEditor>;
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RecipeEditor],
            providers: [
                FormBuilder,
                { provide: Router, useValue: new MockRouter() },
                { provide: RecipeFacadeService, useValue: new MockRecipeFacadeService() },
                { provide: AuthFacadeService, useValue: new MockAuthFacadeService() },
                { provide: AppFacadeService, useValue: new MockAppFacadeService() },
            ]
        }).compileComponents();
    });
    
    beforeEach(() => {
        fixture = TestBed.createComponent(RecipeEditor);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should set initial values correctly for new recipe', () => {
        component.ngOnInit();

        expect(component.recipeForm.get('title')?.value).toEqual('');
        expect(component.recipeForm.get('ingredients')?.value).toEqual([]);
        expect(component.recipeForm.get('instructions')?.value).toEqual([]);
        expect(component.isEditingTitle).toBeTruthy();
        expect(component.isEditingYield).toBeTruthy();
        expect(component.isEditingIngredients).toBeTruthy();
        expect(component.isEditingInstructions).toBeTruthy();
    });

});