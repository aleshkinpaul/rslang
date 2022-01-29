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

  getAllUserWords(id: string, token: string): Observable<IUserWord[]> {
    return this.http.get<IUserWord[]>(`${BACKEND_PATH}/users/${id}/words`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  createUserWord(id: string, wordId: string, word: IWord, token: string): Observable<IUserWord> {
    return this.http.post<IUserWord>(`${BACKEND_PATH}/users/${id}/words/${wordId}`, word, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  getUserWordById(id: string, wordId: string, token: string): Observable<IWord> {
    return this.http.get<IWord>(`${BACKEND_PATH}/users/${id}/words/${wordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  updateUserWord(id: string, wordId: string, word: IWord, token: string): Observable<IWord> {
    return this.http.put<IWord>(`${BACKEND_PATH}/users/${id}/words/${wordId}`, word, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  deleteUserWord(id: string, wordId: string, word: IWord, token: string) {
    return this.http.delete(`${BACKEND_PATH}/users/${id}/words/${wordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  getAllUserAggregatedWords(id: string, requestParams: IAggregatedRequestParams, token: string): Observable<IWord[]> {
    return this.http.get<IWord[]>(`${BACKEND_PATH}/users/${id}/aggregatedWords`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: { ...requestParams }
    });
  }

  getUserAggregatedWordById(id: string, wordId: string, token: string): Observable<IWord> {
    return this.http.get<IWord>(`${BACKEND_PATH}/users/${id}/aggregatedWords/${wordId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  getStatistics(id: string, token: string): Observable<IStatistic> {
    return this.http.get<IStatistic>(`${BACKEND_PATH}/users/${id}/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  upsertStatistics(id: string, statistics: IStatistic, token: string): Observable<IStatistic> {
    return this.http.put<IStatistic>(`${BACKEND_PATH}/users/${id}/statistics`, statistics, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  getSettings(id: string, token: string): Observable<ISettings> {
    return this.http.get<ISettings>(`${BACKEND_PATH}/users/${id}/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }

  upsertSettings(id: string, settings: ISettings, token: string): Observable<ISettings> {
    return this.http.put<ISettings>(`${BACKEND_PATH}/users/${id}/settings`, settings, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  }
}
