import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import * as AppReducer from '../store/app.reducer';

import { RecipeService } from './recipe.service';
import { AuthService } from './auth.service';

import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private baseUrl = 'https://recipe-book-81190.firebaseio.com/';
  private recipesUrl = this.baseUrl + 'recipes.json';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    // private store: Store<AppReducer.AppState>,
    private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    // For firebase if put uses instead of post every data will overritten.
    return this.http.put(this.recipesUrl, recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.recipesUrl)
      .pipe(
        take(1),  // Takes given item just "1" time(s) and unsubscribe it.
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
