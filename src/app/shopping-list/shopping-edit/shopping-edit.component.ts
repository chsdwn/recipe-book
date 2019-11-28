import { Component, OnInit, ElementRef, ViewChild, Output, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as AppReducer from '../../store/app.reducer';

import * as ShoppingListActions from '../store/shopping-list.actions';

import { Ingredient } from 'src/app/models/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form', {static: true}) shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<AppReducer.AppState>) {}

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }
    form.reset();
    this.editMode = false;
  }

  onClear() {
    this.shoppingListForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.editMode = false;
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
