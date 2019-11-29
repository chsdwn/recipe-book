import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as AppReducer from '../../store/app.reducer';
import * as RecipesActions from './recipe.actions';

import { Recipe } from 'src/app/models/recipe.model';

@Injectable()
export class RecipesEffect {
  @Effect()
  fecthRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(environment.recipesUrl);
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    map(([actionData, recipesState]) => {
      return this.http.put(environment.recipesUrl, recipesState.recipes)
      .subscribe(response => {
        console.log(response);
      });
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppReducer.AppState>) {}
}
