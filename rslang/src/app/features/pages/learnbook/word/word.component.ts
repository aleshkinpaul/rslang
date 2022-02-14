import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAggregatedResponseWord, IWord } from 'src/app/shared/interfaces';
import { BACKEND_PATH } from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  @Input() wordData!: IAggregatedResponseWord | IWord;
  @Output() clickAudio: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() checkWord: EventEmitter<void> = new EventEmitter<void>();
  
  wordId!: string;
  wordCardContentText: string = '';
  wordAudioSrcArr!: Array<string>;
  currentAudioInd: number = 0;
  isMeaningShow: boolean = false;
  isExampleShow: boolean = false;
  isHard: boolean = false;
  isStudied: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.wordAudioSrcArr = [this.wordData.audio, this.wordData.audioMeaning, this.wordData.audioExample];
    this.wordAudioSrcArr = this.wordAudioSrcArr.map(src => this.getAudio(src));
    this.wordId = ('_id' in this.wordData) ? this.wordData._id : this.wordData.id;
    this.isLoggedIn = !!this.authService.userId;
    if ('userWord' in this.wordData) {
      this.isHard = this.wordData.userWord ? this.wordData.userWord.difficulty === 'hard' : false;
      this.isStudied = this.wordData.userWord ? this.wordData.userWord.optional.isStudied : false;
    }
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

  updateUserWord() {
    if ('userWord' in this.wordData) {
      this.apiService.updateUserWord(this.authService.userId, this.wordId, {
        difficulty: this.isHard ? 'hard' : 'easy',
        optional: {
          isStudied: this.isStudied,
          correctAnswers: this.wordData.userWord!.optional.correctAnswers,
          wrongAnswers: this.wordData.userWord!.optional.wrongAnswers,
          correctSeries: this.wordData.userWord!.optional.correctSeries,
        }
      })
      .subscribe(() => this.checkWord.emit());
    }
    else {
      this.apiService.createUserWord(this.authService.userId, this.wordId, {
        difficulty: this.isHard ? 'hard' : 'easy',
        optional: {
          isStudied: this.isStudied,
          correctAnswers: 0,
          wrongAnswers: 0,
          correctSeries: 0,
        }
      })
      .subscribe(() => this.checkWord.emit());
    }              
  }

  checkAsHard() {
    if (!this.isStudied) {
      this.isHard = !this.isHard;
      this.updateUserWord();
    }
  }

  checkAsStudied() {
    this.isStudied = !this.isStudied;
    this.isHard = false;
    this.updateUserWord();
  }
}
