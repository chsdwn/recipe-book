import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RecipesModule } from './recipes/recipes.module';
import { RecipesRoutingModule } from './recipes/recipes-routing.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';

@NgModule({
   // You only use a declaration in project once.
   declarations: [
      AppComponent,
      HeaderComponent,
      AuthComponent
   ],
   imports: [
      AppRoutingModule,
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      RecipesModule,
      RecipesRoutingModule,
      ShoppingListModule,
      SharedModule,
      CoreModule
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
