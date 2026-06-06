import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientsForm } from './ingredients-form.ts';
import { FormBuilder } from '@angular/forms';
import { UIFacadeService } from '../../../features/ui/services/ui.facade';

class MockUIFacadeService {
  showUndoable = jest.fn();
}

describe('IngredientsForm', () => {
  let component: IngredientsForm;
  let fixture: ComponentFixture<IngredientsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsForm],
      providers: [
        FormBuilder,
        { provide: UIFacadeService, useValue: new MockUIFacadeService() }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add ingredient to form array', () => {
    const initialLength = component.ingredients.length;
    
    component.addIngredient();
    
    expect(component.ingredients.length).toBe(initialLength + 1);
  });
  
  it('should remove ingredient and emit change', () => {
    const spy = jest.spyOn(component.ingredientsChange, 'emit');
    
    component.removeIngredient(0);
    
    expect(component.ingredients.length).toBe(0);
    expect(spy).toHaveBeenCalled();
  });

});