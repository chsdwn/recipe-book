import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Actions, ofType, Effect } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';

import { AuthService } from 'src/app/services/auth.service';

import { AuthenticationResponse } from 'src/app/models/authentication-response.model';
import { User } from 'src/app/models/user.model';

const handleAuthentication = (id: string, email: string, token: string, expiresIn: string) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(id, email, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  // Don't use of() here. It'll already returns an observable.
  return new AuthActions.AuthenticateSuccess({
    userId: id,
    email,
    token,
    expirationDate,
    redirect: true
  });
};

const handleError = (errorResponse: any) => {
  let errorMessage = 'An error occured.';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
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
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthenticationResponse>(
        environment.signupUrl,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(responseData => {
          this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
        }),
        map(responseData => {
          return handleAuthentication(responseData.localId, responseData.email, responseData.idToken, responseData.expiresIn);
        }),
        catchError(errorResponse => {
          return handleError(errorResponse);
        })
      );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthenticationResponse>(
        environment.loginUrl,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(responseData => {
          this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
        }),
        map(responseData => {
          return handleAuthentication(responseData.localId, responseData.email, responseData.idToken, responseData.expiresIn);
        }),
        catchError(errorResponse => {
          return handleError(errorResponse);
        })
      );
    }),
  );

  @Effect()
  authAutoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        id: string,
        email: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'No Cookie'};
      }
      const loadedUser = new User(userData.id, userData.email, userData._token, new Date(userData._tokenExpirationDate));

      if (loadedUser.token) {
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
          userId: loadedUser.id,
          email: loadedUser.email,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        });
      } else {
        return { type: 'No Cookie'};
      }
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/user']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) { }
}
