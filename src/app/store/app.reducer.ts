import { ActionReducerMap } from '@ngrx/store';

import * as ShoppingListReducer from '../shopping-list/store/shopping-list.reducer';
import * as AuthReducer from '../auth/store/auth.reducer';
import * as RecipesReducer from '../recipes/store/recipe.reducer';

export interface AppState {
  shoppingList: ShoppingListReducer.State;
  auth: AuthReducer.State;
  recipes: RecipesReducer.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: ShoppingListReducer.shoppingListReducer,
  auth: AuthReducer.authReducer,
  recipes: RecipesReducer.recipeReducer
};
