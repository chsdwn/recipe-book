import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as AppReducer from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

import { AuthenticationResponse } from '../models/authentication-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signupBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  private signupUrl = this.signupBaseUrl + environment.firebaseAPIKey;
  private loginBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
  private loginUrl = this.loginBaseUrl + environment.firebaseAPIKey;

  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<AppReducer.AppState>) { }

  signup(email: string, password: string) {
    return this.http.post<AuthenticationResponse>(
      this.signupUrl,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(responseData => {
        this.handleAuthenticationResponse(
          responseData.localId,
          responseData.email,
          responseData.idToken,
          responseData.expiresIn
        );
      }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthenticationResponse>(
      this.loginUrl,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(responseData => {
        this.handleAuthenticationResponse(
          responseData.localId,
          responseData.email,
          responseData.idToken,
          responseData.expiresIn
        );
      }));
  }

  autoLogin() {
    const userData: {
      id: string,
      email: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.id, userData.email, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.store.dispatch(new AuthActions.AuthenticateSuccess({
        userId: loadedUser.id,
        email: loadedUser.email,
        token: loadedUser.token,
        expirationDate: new Date(userData._tokenExpirationDate)
      }));
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/user']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthenticationResponse(id: string, email: string, token: string, expiresIn: string) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(id, email, token, expirationDate);
    this.store.dispatch(new AuthActions.AuthenticateSuccess({
      userId: user.id,
      email: user.email,
      token: user.token,
      expirationDate
    }));
    this.autoLogout(+expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An error occured.';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email address already registered.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email has not registered.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Check your password and try again.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This user has been banned.';
        break;
    }
    return throwError(errorMessage);
  }
}
