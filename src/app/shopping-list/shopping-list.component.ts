import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ShoppingListService } from '../services/shopping-list.service';

import { Ingredient } from '../models/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ingredients: Ingredient[]}>;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }
}
