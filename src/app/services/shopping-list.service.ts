import { Subject } from 'rxjs';

import { Ingredient } from '../models/ingredient.model';

export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients() {
        // Returns a copy
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.getIngredients());
    }

    addIngredients(ingredients: Ingredient[]) {
        /* for(var ingredient in ingredients) {
            this.ingredients.push(ingredient);
        } */
        /* let counter = 0;
        const length = ingredients.length;
        console.log(length);
        while (counter < length) {
            this.ingredients.push(ingredients[counter]);
            console.log(counter);
            counter++;
        } */
        /* for (const ingredient of ingredients) {
            this.ingredients.push(ingredient);
        } */
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.getIngredients());
    }
}
