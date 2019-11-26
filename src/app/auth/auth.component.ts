import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

import { AuthenticationResponse } from '../models/authentication-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  userForm: FormGroup;
  error: string = null;
  isLoginMode = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
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
        }
      );
    } else {
      return;
    }
  }
}
