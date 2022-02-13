import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IWord } from 'src/app/shared/interfaces';
import { BACKEND_PATH } from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  @Input() wordData!: IWord;
  @Output() clickAudio: EventEmitter<string[]> = new EventEmitter<string[]>();
  
  wordCardContentText: string = '';
  wordAudioSrcArr!: Array<string>;
  currentAudioInd: number = 0;
  isMeaningShow: boolean = false;
  isExampleShow: boolean = false;
  isHard: boolean = false;
  isKnown: boolean = false;

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.wordAudioSrcArr = [this.wordData.audio, this.wordData.audioMeaning, this.wordData.audioExample];
    this.wordAudioSrcArr = this.wordAudioSrcArr.map(src => this.getAudio(src));
  }

  getImage() {
    return `${BACKEND_PATH}/${this.wordData.image}`;
  }

  getAudio(srcPath: string) {
    return `${BACKEND_PATH}/${srcPath}`;
  }

  showMeaning() {
    this.wordCardContentText = `${this.wordData.textMeaning}<br>${this.wordData.textMeaningTranslate}`;
    this.isMeaningShow = true;
  }

  showExample() {
    this.wordCardContentText = `${this.wordData.textExample}<br>${this.wordData.textExampleTranslate}`;
    this.isExampleShow = true;
  }

  hideText(): void {
    this.wordCardContentText = '';
    this.isExampleShow = false;
    this.isMeaningShow = false;
  }

  playAudio() {
    this.clickAudio.emit(this.wordAudioSrcArr);
  }

  addUserWord() {
    this.apiService.getUserWordById(this.authService.userId, this.wordData.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.apiService.createUserWord(this.authService.userId, this.wordData.id, {
              difficulty: this.isHard ? 'hard' : 'easy',
              optional: {
                isStudied: false,
                correctAnswers: 0,
                wrongAnswers: 0,
                correctSeries: 0,
              }
            })
            .subscribe();
          }
          return throwError(() => error);
        })
      )
      .subscribe(
        (res) => this.apiService.updateUserWord(this.authService.userId, this.wordData.id, {
          difficulty: this.isHard ? 'hard' : 'easy',
          optional: {
            isStudied: false,
            correctAnswers: 0,
            wrongAnswers: 0,
            correctSeries: 0,
          }
        })
      )
  }

  checkAsHard() {

  }

  checkAsKnown() {

  }
}
