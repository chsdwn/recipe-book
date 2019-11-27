import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ShoppingListService } from './services/shopping-list.service';
import { AuthInterceptor } from './services/auth-interceptor.service';

@NgModule({
  // Use Injectable for services instead of this method.
  providers: [
    ShoppingListService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class CoreModule { }
