import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';

import * as AppReducer from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild(PlaceholderDirective, {static: true}) alertHost: PlaceholderDirective;
  userForm: FormGroup;
  authSubscription: Subscription;
  error: string = null;
  isLoginMode = false;
  isLoading = false;
  private alertComponentCloseSubscription: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<AppReducer.AppState>
  ) {}

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
    this.authSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  ngOnDestroy() {
    if (this.alertComponentCloseSubscription) {
      this.alertComponentCloseSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  onSubmit() {
    this.error = null;
    if (this.userForm.valid) {
      if (this.isLoginMode) {
        this.store.dispatch(new AuthActions.LoginStart({
          email: this.userForm.value.email,
          password: this.userForm.value.password
        }));
      } else {
        this.store.dispatch(new AuthActions.SignupStart({
          email: this.userForm.value.email,
          password: this.userForm.value.password
        }));
        this.userForm.reset();
      }
    } else {
      return;
    }
  }

  private showErrorAlert(message: string) {
    // Don't use this method if you don't have to.
    // const alertComponent = new AlertComponent();
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    componentRef.instance.message = message;
    this.alertComponentCloseSubscription = componentRef.instance.close.subscribe(() => {
      this.alertComponentCloseSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
