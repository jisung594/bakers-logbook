import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeEditor } from './recipe-editor.ts';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { RecipeFacadeService } from '../../features/recipes/services/recipe.facade';
import { AuthFacadeService } from '../../features/auth/services/auth.facade';
import { AppFacadeService } from '../../features/app/services/app.facade';
import { Recipe } from '../../models/recipe.model.ts';

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

describe('RecipeEditor - Initialization', () => {
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

  it('should initialize form with empty values for new recipe', () => {
    component.recipeId = null;
    component.ngOnInit();
    
    expect(component.recipeForm.get('title')?.value).toBe('');
    expect(component.recipeForm.get('yieldAmount')?.value).toBe(1);
    expect(component.recipeForm.get('yieldUnit')?.value).toBe('unit');
    expect(component.recipeForm.get('ingredients')?.value).toEqual([]);
  });


  it('should populate form with existing recipe data', () => {
    const existingRecipe: Recipe = {
      id: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'Canelés',
      yield: { amount: 12, unit: 'servings' },
      ingredients: [
        { name: 'flour', quantity: '1', unit: 'cup', customUnit: '' },
        { name: 'beeswax', quantity: '1', unit: 'tbsp', customUnit: '' }
      ],
      instructions: [
        { step: '1', order: 1, notes: 'Mix ingredients' },
        { step: '2', order: 2, notes: 'Apply beeswax to molds' }
      ],
      isPublic: false,
      archived: false
    };

    const fb = TestBed.inject(FormBuilder);
  
    // Convert plain objects to FormGroups
    const ingredientRows = existingRecipe.ingredients.map(ing => 
      fb.group({
        name: fb.control(ing.name, { nonNullable: true }),
        quantity: fb.control(ing.quantity, { nonNullable: true }),
        unit: fb.control(ing.unit, { nonNullable: true }),
        customUnit: fb.control(ing.customUnit, { nonNullable: true })
      })
    );
  
    const instructionRows = existingRecipe.instructions.map(inst => 
      fb.group({
        step: fb.control(inst.step, { nonNullable: true }),
        order: fb.control(inst.order, { nonNullable: true }),
        notes: fb.control(inst.notes, { nonNullable: true })
      })
    );

    component.title = existingRecipe.title;
    component.yield = existingRecipe.yield;
    component.ingredients = ingredientRows;
    component.instructions = instructionRows;
    component.isPublic = existingRecipe.isPublic;
    component.archived = existingRecipe.archived;
    component.ngOnInit();

    expect(component.recipeForm.get('title')?.value).toBe('Canelés');
    expect(component.recipeForm.get('yieldAmount')?.value).toBe(12);
    expect(component.recipeForm.get('yieldUnit')?.value).toBe('servings');
    expect(component.recipeForm.get('ingredients')?.value).toEqual(existingRecipe.ingredients);
    expect(component.recipeForm.get('ingredients')?.value).toHaveLength(2);
    expect(component.recipeForm.get('instructions')?.value).toEqual(existingRecipe.instructions);
    expect(component.recipeForm.get('instructions')?.value).toHaveLength(2);
    expect(component.recipeForm.get('isPublic')?.value).toBe(false);
  });
});

describe('RecipeEditor - Validation', () => {
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

    fixture = TestBed.createComponent(RecipeEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be invalid when title is empty', () => {
    component.recipeForm.get('title')?.setValue('');
    expect(component.recipeForm.valid).toBeFalsy();
    expect(component.recipeForm.get('title')?.errors?.['required']).toBeTruthy();
  });

  it('should be invalid when yieldAmount is less than 1', () => {
    component.recipeForm.get('yieldAmount')?.setValue(0);
    expect(component.recipeForm.valid).toBeFalsy();
    expect(component.recipeForm.get('yieldAmount')?.errors?.['min']).toBeTruthy();
  });

  it('should be valid when required fields are present', () => {
    component.recipeForm.patchValue({
      title: 'Valid Recipe',
      yieldAmount: 1
    });
    expect(component.recipeForm.valid).toBeTruthy();
  });
});

describe('RecipeEditor - Saving', () => {
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

    fixture = TestBed.createComponent(RecipeEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not save when form is invalid', () => {
    const recipeFacade = TestBed.inject(RecipeFacadeService);
    component.recipeForm.patchValue({ title: '' });
    
    component.saveRecipe();
    
    expect(recipeFacade.saveRecipe).not.toHaveBeenCalled();
  });

  it('should call saveRecipe with correct form data', async () => {
    const recipeFacade = TestBed.inject(RecipeFacadeService);

    const mockSaveRecipe = jest.fn().mockResolvedValue('mock-id');
    recipeFacade.saveRecipe = mockSaveRecipe;
    
    component.recipeForm.patchValue({
      title: 'Newly Saved Recipe',
      yieldAmount: 3,
      yieldUnit: 'loaves',
      ingredients: [],
      instructions: []
    });
    
    await component.saveRecipe();
    
    expect(recipeFacade.saveRecipe).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Newly Saved Recipe',
        yield: { amount: 3, unit: 'loaves' }
      })
    );
  });

  it('should navigate to recipe detail page after successful save', async () => {
    const recipeFacade = TestBed.inject(RecipeFacadeService);
    const router = TestBed.inject(Router);

    const mockSaveRecipe = jest.fn().mockResolvedValue('mock-id');
    recipeFacade.saveRecipe = mockSaveRecipe;
    
    component.recipeForm.patchValue({
      title: 'Newly Saved Recipe',
      yieldAmount: 3,
      yieldUnit: 'loaves',
      ingredients: [],
      instructions: []
    });
    
    await component.saveRecipe();
  
    expect(router.navigate).toHaveBeenCalledWith(['/recipes', 'mock-id']);
  });

  it('should not navigate when save fails', async () => {
    const recipeFacade = TestBed.inject(RecipeFacadeService);
    const router = TestBed.inject(Router);

    recipeFacade.saveRecipe = jest.fn().mockRejectedValue(
      new Error('Save failed')
    );
    
    await component.saveRecipe();
    
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
