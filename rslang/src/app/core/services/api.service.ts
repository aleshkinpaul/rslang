import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IWord } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getWords(page: number, group: number): Observable<IWord[]> {
    return this.http.get<IWord[]>(`https://rslang-back-app.herokuapp.com/words`, {
      params: {
        page: page,
        group: group
      }
    });
  }

  getWord(id: string): Observable<IWord> {
    return this.http.get<IWord>(`https://rslang-back-app.herokuapp.com/words/${id}`);
  }
}
