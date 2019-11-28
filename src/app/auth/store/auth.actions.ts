import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: {userId: string, email: string, token: string, expirationDate: Date}) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions =
  | Login
  | Logout;
