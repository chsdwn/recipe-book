import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild([{path: 'user', component: AuthComponent}]),
    SharedModule
  ],
  exports: [RouterModule]
})
export class AuthModule {}
