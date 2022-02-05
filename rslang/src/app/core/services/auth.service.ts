import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { IAuth, IRefreshAuth, IUserData } from 'src/app/shared/interfaces';
import { ERROR_MESSAGE, EXP_TIME, REFRESH_TIME } from '../constants/constant';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loginError$ = new Subject<string>();
  public updateLoginError$ = new Subject<string>();
  public isAuthenticated = false;
  public userId = '';
  public token = '';
  public name = '';
  private refreshToken = '';
  private expDate: Date | null = null;
  public avatarPath = '';


  constructor(private api: ApiService) {
    this.initAuth();
  }

  private initAuth() {
    if (localStorage.getItem('lang-token') !== null) {
      this.loadFromLocal();
      if (this.IsSessionEnd()) {
        this.updateLogin();
      } else {
        this.setTimeoutToRefreshLogin();
      }
    }
  }

  public login(user: IUserData): Observable<IAuth> {
    return this.api.signIn(user)
      .pipe(
        map((response) => {
          this.loginError$.next('');
          this.setData(response);
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.loginError$.next(ERROR_MESSAGE.login);
          }
          if (error.status === 404) {
            this.loginError$.next(ERROR_MESSAGE.login);
          }
          return throwError(() => error)
        })
      );
  }

  public logout() {
    this.isAuthenticated = false;
    this.userId = '';
    this.token = '';
    this.refreshToken = '';
    this.name = '';
    this.expDate = null;
    this.avatarPath = '';
    localStorage.clear();
  }

  public updateLogin() {
    this.api.getNewUserTokens(this.userId, this.refreshToken)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.logout();
          if (error.status === 403) {
            this.updateLoginError$.next(ERROR_MESSAGE.updateLogin);
          }
          if (error.status === 401) {
            this.updateLoginError$.next(ERROR_MESSAGE.unauthorized);
          }
          return throwError(() => error);
        })
      )
      .subscribe((response) => {
        this.updateLoginError$.next('');
        this.updateData(response);
        this.setTimeoutToRefreshLogin();
      })
  }

  private setTimeoutToRefreshLogin() {
    const endSessionTime = (this.expDate!.getTime() - new Date().getTime()) * 1000;
    setTimeout(() => {
      this.updateLogin();
    }, endSessionTime - REFRESH_TIME);
  }

  private setData(response: IAuth) {
    this.expDate = new Date(new Date().getTime() + EXP_TIME);
    this.userId = response.userId;
    this.token = response.token;
    this.refreshToken = response.refreshToken;
    this.isAuthenticated = true;
    this.name = response.name;
    this.saveToLocal();
  }

  private updateData(response: IRefreshAuth) {
    this.expDate = new Date(new Date().getTime() + EXP_TIME);
    this.token = response.token;
    this.refreshToken = response.refreshToken;
    this.saveToLocal();
  }

  private IsSessionEnd() {
    if (this.expDate !== null && new Date() > this.expDate) {
      return true;
    }
    return false;
  }

  public saveToLocal() {
    localStorage.setItem('lang-user-id', this.userId);
    localStorage.setItem('lang-token', this.token);
    localStorage.setItem('lang-refresh-token', this.refreshToken);
    localStorage.setItem('lang-is-authenticated', this.isAuthenticated.toString());
    localStorage.setItem('lang-exp-date', this.expDate!.toString());
    localStorage.setItem('lang-name', this.name.toString());
    localStorage.setItem('lang-avatar', this.avatarPath.toString());
  }

  private loadFromLocal() {
    this.userId = localStorage.getItem('lang-user-id')!;
    this.token = localStorage.getItem('lang-token')!;
    this.refreshToken = localStorage.getItem('lang-refresh-token')!;
    this.isAuthenticated = JSON.parse(localStorage.getItem('lang-is-authenticated')!);
    this.expDate = new Date(localStorage.getItem('lang-exp-date')!);
    this.name = localStorage.getItem('lang-name')!;
    this.avatarPath = localStorage.getItem('lang-avatar')!;
  }
}
