import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAggregatedRequestParams, IAuth, ISettings, IStatistic, IUser, IUserData, IUserWord, IWord } from 'src/app/shared/interfaces';
import { BACKEND_PATH } from '../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getWords(page: number, group: number): Observable<IWord[]> {
    return this.http.get<IWord[]>(`${BACKEND_PATH}/words`, {
      params: {
        page: page,
        group: group
      }
    });
  }

  getWord(id: string): Observable<IWord> {
    return this.http.get<IWord>(`${BACKEND_PATH}/words/${id}`);
  }

  signIn(userData: IUserData): Observable<IAuth> {
    return this.http.post<IAuth>(`${BACKEND_PATH}/signin`, userData);
  }

  createNewUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${BACKEND_PATH}/users`, user);
  }

  getUser(id: string, token: string): Observable<IUser> {
    return this.http.get<IUser>(`${BACKEND_PATH}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  updateUser(id: string, token: string, userData: IUserData): Observable<IUser> {
    return this.http.put<IUser>(`${BACKEND_PATH}/users/${id}`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  deleteUser(id: string, token: string) {
    return this.http.delete(`${BACKEND_PATH}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  getNewUserTokens(id: string, refreshToken: string): Observable<IAuth> {
    return this.http.get<IAuth>(`${BACKEND_PATH}/users/${id}/tokens`, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
      }
    });
  }
  }
}
