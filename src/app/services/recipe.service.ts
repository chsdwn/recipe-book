import { Injectable } from '@angular/core';

import { ShoppingListService } from './shopping-list.service';

import { Recipe } from '../models/recipe.model';
import { Ingredient } from '../models/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    private recipes: Recipe[] = [
        new Recipe(
            1,
            'Pizza Poğaça',
            'Çocuklarınız için sağlıklı poğaçalar.',
            'https://i.nefisyemektarifleri.com/2019/11/14/pizza-pogaca.jpg',
            [
                new Ingredient('Meat', 2),
                new Ingredient('Cheese', 5)
            ]),
        new Recipe(
            2,
            'Pideli Köfte',
            'Bursa usülü pideli köfte.',
            'https://i.nefisyemektarifleri.com/2019/11/14/bursa-pideli-kofte.jpg',
            [
                new Ingredient('Meat', 2),
                new Ingredient('Salt', 1)
            ])
    ];
    recipesChanged = new Subject<Recipe[]>();

    constructor(private shoppingListService: ShoppingListService) {}

    getRecipe(id: number) {
        const recipe = this.recipes.find(
            (r) => {
                return r.id === id;
            }
        );
        return recipe;
    }

    getRecipes() {
        // Returns a copy
        return this.recipes.slice();
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.getRecipes());
    }

    updateRecipe(id: number, recipe: Recipe) {
        const index = id - 1;
        this.recipes[index] = recipe;
        this.recipesChanged.next(this.getRecipes());
    }

    deleteRecipe(id: number) {
        this.recipes.splice(id - 1, 1);
        this.recipesChanged.next(this.getRecipes());
    }

    addIngredientsToShoppingList(recipe: Recipe) {
        this.shoppingListService.addIngredients(recipe.ingredients);
    }
}
