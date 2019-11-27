import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RecipesModule } from './recipes/recipes.module';
import { RecipesRoutingModule } from './recipes/recipes-routing.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AlertComponent } from './shared/alert/alert.component';

import { ShoppingListService } from './services/shopping-list.service';
import { AuthInterceptor } from './services/auth-interceptor.service';

import { DropdownDirective } from './shared/dropdown.directive';
import { PlaceholderDirective } from './shared/placeholder.directive';


@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      AuthComponent,
      LoadingSpinnerComponent,
      AlertComponent,
      DropdownDirective,
      PlaceholderDirective
   ],
   imports: [
      AppRoutingModule,
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      RecipesModule,
      RecipesRoutingModule,
      ShoppingListModule
   ],
   providers: [
      ShoppingListService,
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
   ],
   bootstrap: [
      AppComponent
   ],
   // It creates components without selectors or route
   entryComponents: [
      AlertComponent
   ]
})
export class AppModule { }
