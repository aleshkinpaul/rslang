import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import { IAuth, IUserData } from 'src/app/shared/interfaces';
import { ERROR_MESSAGE, EXP_TIME } from '../constants/constant';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loginError$: Subject<string> = new Subject<string>();
  public updateLoginError$: Subject<string> = new Subject<string>();
  public isAuthenticated = false;
  public userId = '';
  public token = '';
  public refreshToken = '';
  private expDate: Date | null = null;

  constructor(private api: ApiService) {
    this.initAuth();
  }

  initAuth() {
    const expDateFromLocal = localStorage.getItem('lang-token-exp');
    if (expDateFromLocal !== null) {
      this.loadFromLocal();
      if (this.IsSessionEnd()) {
        this.updateLogin();
      }
    }
  }

  login(user: IUserData) {
    this.api.signIn(user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.loginError$.next(ERROR_MESSAGE.login);
          }
          return throwError(() => error)
        })
      )
      .subscribe((response) => {
        this.loginError$.next('');
        this.setData(response);
      });
  }

  logout() {
    this.isAuthenticated = false;
    this.userId = '';
    this.token = '';
    this.refreshToken = '';
    this.expDate = null;
    localStorage.clear();
  }

  public updateLogin() {
    this.api.getNewUserTokens(this.userId, this.refreshToken)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.updateLoginError$.next(ERROR_MESSAGE.updateLogin);
          }
          if (error.status === 401) {
            this.updateLoginError$.next(ERROR_MESSAGE.unauthorized);
          }

          return throwError(() => error)
        })
      )
      .subscribe((response) => {
        this.updateLoginError$.next('');
        this.setData(response);
      })
  }

  private setData(response: IAuth) {
    this.expDate = new Date(localStorage.getItem('fb-token-exp')!);
    this.userId = response.userId;
    this.token = response.token;
    this.refreshToken = response.refreshToken;
    this.isAuthenticated = true;
    this.saveToLocal();
  }

  IsSessionEnd() {
    if (this.expDate !== null && new Date() < this.expDate) {
      return true;
    }
    return false;
  }

  saveToLocal() {
    localStorage.setItem('lang-user-id', this.userId);
    localStorage.setItem('lang-token', this.token);
    localStorage.setItem('lang-refresh-token', this.refreshToken);
    localStorage.setItem('lang-is-authenticated', this.isAuthenticated.toString());
    localStorage.setItem('lang-token-exp', this.expDate!.toString());
  }

  loadFromLocal() {
    this.expDate = new Date(localStorage.getItem('lang-user-exp')!);
    this.userId = localStorage.getItem('lang-user-id')!;
    this.token = localStorage.getItem('lang-token')!;
    this.isAuthenticated = JSON.parse(localStorage.getItem('lang-is-authenticated')!);
    this.refreshToken = localStorage.getItem('lang-refresh-token')!;
  }
}
