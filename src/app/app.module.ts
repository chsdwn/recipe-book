import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RecipesModule } from './recipes/recipes.module';
import { RecipesRoutingModule } from './recipes/recipes-routing.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { AlertComponent } from './shared/alert/alert.component';

import { ShoppingListService } from './services/shopping-list.service';
import { AuthInterceptor } from './services/auth-interceptor.service';

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
      SharedModule
   ],
   providers: [
      ShoppingListService,
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
