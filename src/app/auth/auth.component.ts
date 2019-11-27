import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { AlertComponent } from '../shared/alert/alert.component';

import { AuthService } from '../services/auth.service';

import { AuthenticationResponse } from '../models/authentication-response.model';

import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild(PlaceholderDirective, {static: true}) alertHost: PlaceholderDirective;
  userForm: FormGroup;
  error: string = null;
  isLoginMode = false;
  isLoading = false;
  private alertComponentCloseSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnDestroy() {
    if (this.alertComponentCloseSubscription) {
      this.alertComponentCloseSubscription.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.error = null;
  }

  onSubmit() {
    let authenticationObservable = new Observable<AuthenticationResponse>();
    this.error = null;
    if (this.userForm.valid) {
      this.isLoading = true;
      if (this.isLoginMode) {
        authenticationObservable = this.authService.login(this.userForm.value.email, this.userForm.value.password);
      } else {
        authenticationObservable = this.authService.signup(this.userForm.value.email, this.userForm.value.password);
        this.userForm.reset();
      }

      authenticationObservable.subscribe(
        signupResponseData => {
          this.isLoading = false;
          this.router.navigate(['/recipes']);
          console.log(signupResponseData);
        }, errorMessage => {
          this.isLoading = false;
          this.error = errorMessage;
          this.showErrorAlert(errorMessage);
        }
      );
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
