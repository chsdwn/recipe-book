import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthenticationResponse } from '../models/authentication-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseWebApiKey = 'AIzaSyCbhCDHA8mJNmdr8YU9pwn6v2G1GDq9S5Y';
  private signupBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  private signupUrl = this.signupBaseUrl + this.firebaseWebApiKey;
  private loginBaseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
  private loginUrl = this.loginBaseUrl + this.firebaseWebApiKey;

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

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
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.id, userData.email, userData._token, userData._tokenExpirationDate);

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
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
    this.user.next(user);
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
