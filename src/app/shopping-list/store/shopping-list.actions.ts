import { Action } from '@ngrx/store';

import { Ingredient } from '../../models/ingredient.model';

export const ADD_INGREDIENT = 'ADD_INGREDIENT';

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  // You don't need to use exact same variable name unlike 'type'
  payload: Ingredient;
}
