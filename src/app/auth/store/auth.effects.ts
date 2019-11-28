import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Actions, ofType, Effect } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';

import { AuthenticationResponse } from 'src/app/models/authentication-response.model';

@Injectable()
export class AuthEffects {
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
      )
        .pipe(
          map(responseData => {
            const expirationDate = new Date(new Date().getTime() + +responseData.expiresIn * 1000);
            // Don't use of() here. It'll already returns an observable.
            return new AuthActions.Login({
              userId: responseData.localId,
              email: responseData.email,
              token: responseData.idToken,
              expirationDate
            });
          }),
          catchError(errorResponse => {
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
            return of(new AuthActions.LoginFail(errorMessage));
          })
        );
    }),
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }
}
