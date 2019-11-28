import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as AppReducer from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

import { DataStorageService } from '../services/data-storage.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  isAuthenticated = false;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<AppReducer.AppState>) {}

  ngOnInit() {
    this.userSubscription = this.store.select('auth')
      .pipe(map(authState => {
        return authState.user;
      }))
      .subscribe(user => {
      this.isAuthenticated = !!user; // !user ? false : true;
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
