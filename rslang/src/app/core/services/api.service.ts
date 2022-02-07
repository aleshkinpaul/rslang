import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAggregatedRequestParams, IAggregatedResponseWords, IAuth, IRefreshAuth, ISettings, IStatistic, IUser, IUserCreate, IUserData, IUserWord, IWord } from 'src/app/shared/interfaces';
import { BACKEND_PATH, UPLOAD_IMAGES_PATH, UPLOAD_IMAGES_PRESET } from '../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getWords(page: number, group: number): Observable<IWord[]> {
    return this.http.get<IWord[]>(`${BACKEND_PATH}/words`, {
      params: {
        page: page,
        group: group
      }
    });
  }

  public getWord(id: string): Observable<IWord> {
    return this.http.get<IWord>(`${BACKEND_PATH}/words/${id}`);
  }

  public signIn(userData: IUserData): Observable<IAuth> {
    return this.http.post<IAuth>(`${BACKEND_PATH}/signin`, userData);
  }

  public createNewUser(user: IUser): Observable<IUserCreate> {
    return this.http.post<IUserCreate>(`${BACKEND_PATH}/users`, user);
  }

  public getUser(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${BACKEND_PATH}/users/${id}`);
  }

  public updateUser(id: string, userData: IUserData): Observable<IUser> {
    return this.http.put<IUser>(`${BACKEND_PATH}/users/${id}`, userData);
  }

  public deleteUser(id: string) {
    return this.http.delete(`${BACKEND_PATH}/users/${id}`);
  }

  public getNewUserTokens(id: string, refreshToken: string): Observable<IRefreshAuth> {
    return this.http.get<IAuth>(`${BACKEND_PATH}/users/${id}/tokens`, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
      }
    });
  }

  public getAllUserWords(id: string): Observable<IUserWord[]> {
    return this.http.get<IUserWord[]>(`${BACKEND_PATH}/users/${id}/words`);
  }

  public createUserWord(id: string, wordId: string, word: IUserWord): Observable<IUserWord> {
    return this.http.post<IUserWord>(`${BACKEND_PATH}/users/${id}/words/${wordId}`, word);
  }

  public getUserWordById(id: string, wordId: string): Observable<IWord> {
    return this.http.get<IWord>(`${BACKEND_PATH}/users/${id}/words/${wordId}`);
  }

  public updateUserWord(id: string, wordId: string, word: IWord): Observable<IWord> {
    return this.http.put<IWord>(`${BACKEND_PATH}/users/${id}/words/${wordId}`, word);
  }

  public deleteUserWord(id: string, wordId: string, word: IWord) {
    return this.http.delete(`${BACKEND_PATH}/users/${id}/words/${wordId}`);
  }

  public getAllUserAggregatedWords(id: string, requestParams: IAggregatedRequestParams): Observable<IAggregatedResponseWords[]> {
    return this.http.get<IAggregatedResponseWords[]>(`${BACKEND_PATH}/users/${id}/aggregatedWords`, {
      params: { ...requestParams }
    });
  }

  public getUserAggregatedWordById(id: string, wordId: string): Observable<IWord> {
    return this.http.get<IWord>(`${BACKEND_PATH}/users/${id}/aggregatedWords/${wordId}`);
  }

  public getStatistics(id: string): Observable<IStatistic> {
    return this.http.get<IStatistic>(`${BACKEND_PATH}/users/${id}/statistics`);
  }

  public upsertStatistics(id: string, statistics: IStatistic): Observable<IStatistic> {
    return this.http.put<IStatistic>(`${BACKEND_PATH}/users/${id}/statistics`, statistics);
  }

  public getSettings(id: string): Observable<ISettings> {
    return this.http.get<ISettings>(`${BACKEND_PATH}/users/${id}/settings`);
  }

  public upsertSettings(id: string, settings: ISettings): Observable<ISettings> {
    return this.http.put<ISettings>(`${BACKEND_PATH}/users/${id}/settings`, settings);
  }

  public uploadAvatar(image: string): Observable<{ secure_url: string }> {
    return this.http.post<{ secure_url: string }>(UPLOAD_IMAGES_PATH, {
      file: image,
      upload_preset: UPLOAD_IMAGES_PRESET,
    });
  }
}
