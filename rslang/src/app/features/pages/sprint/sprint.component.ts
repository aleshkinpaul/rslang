import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import {
  BACKEND_PATH,
  DEFAULT_SPRINT_LEVEL,
  LEVELS_IN_GAME,
  PAGES_IN_LEVEL,
  WORDS_IN_SPRINT_GAME,
  WORDS_ON_PAGE,
} from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { shuffleArr } from 'src/app/core/utils/utils';
import { IResults, IWord } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss'],
})
export class SprintComponent implements OnInit {
  @ViewChild('audioPlayer', { static: false })
  audio: ElementRef | undefined;

  loadingProgress = false;
  showResultsPage = false;
  gameMode = false;
  selectedLevel = DEFAULT_SPRINT_LEVEL;
  levelsInGame = new Array(LEVELS_IN_GAME);
  isUserRight = false;
  currentQuestion = 0;
  currentTranslateVariant = 0;
  wordsForGame: IWord[] = [];
  results: IResults[] = [];

  constructor(private api: ApiService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      if (data['page']) this.startGameFromLearnbook(data);
    });
    this.results = [];
  }

  startGameFromLearnbook(data: Params) {
    this.loadingProgress = true;
    this.selectedLevel = Number(data['level'] - 1);
    this.gameMode = true;
    this.api.getWords(data['page'], data['level'] - 1).subscribe((res) => {
      this.results = [];
      this.wordsForGame = shuffleArr(<[]>res);
      this.currentQuestion = 0;
      this.getQuestion();
    });
  }

  startGame() {
    this.loadingProgress = true;
    this.gameMode = true;
    this.getRandomWordsForGame(WORDS_IN_SPRINT_GAME).subscribe((res) => {
      this.wordsForGame = res;
      this.results = [];
      this.currentQuestion = 0;
      this.currentTranslateVariant = 0;
      this.getQuestion();
    });
  }

  async getQuestion() {
    this.currentTranslateVariant = this.getCurrentTranslateVariant();
    this.loadingProgress = false;
  }

  getCurrentTranslateVariant() {
    let wrongVariant: number;

    do {
      wrongVariant = this.getRandomNumber(this.wordsForGame.length - 1);
    } while (wrongVariant === this.currentQuestion)

    const variants = [this.currentQuestion, wrongVariant];

    return variants[this.getRandomNumber(variants.length - 1)];
  }

  getRandomWordsForGame(wordsCount: number): Observable<IWord[]> {
    const observables: Observable<IWord>[] = [];
    const wordsReqParams: { word: number; page: number }[] = [];

    while (wordsReqParams.length < wordsCount) {
      const newReqParam = {
        word: this.getRandomNumber(WORDS_ON_PAGE - 1),
        page: this.getRandomNumber(PAGES_IN_LEVEL - 1),
      };

      const isUniqReqParam = !wordsReqParams.find(
        (el) => el.page === newReqParam.page && el.word === newReqParam.word
      );

      if (isUniqReqParam) {
        wordsReqParams.push(newReqParam);
      }
    }

    wordsReqParams.forEach((el) => {
      observables.push(
        this.api.getWords(el.page, this.selectedLevel).pipe(
          map((gettingPage) => {
            return gettingPage[el.word];
          })
        )
      );
    });

    return forkJoin<IWord[]>(observables);
  }

  checkAnswer(isRight: boolean) {
    const isRightTranslate = this.currentQuestion === this.currentTranslateVariant;
    if (isRightTranslate === isRight) {
      this.isUserRight = true;
    } else {
      this.isUserRight = false;
    }

    const result: IResults = {
      isCorrect: this.isUserRight,
      word: this.wordsForGame[this.currentQuestion],
    };
    this.results.push(result);
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentQuestion + 1 === this.wordsForGame.length) {
      this.showResults();
      this.gameMode = !this.gameMode;
    } else {
      this.currentQuestion += 1;
      this.loadingProgress = true;
      this.getQuestion();
    }
  }

  showResults() {
    this.showResultsPage = true;
  }

  getRandomNumber(n: number) {
    return Math.floor(Math.random() * (n + 1));
  }

  getImage() {
    return `${BACKEND_PATH}/${this.wordsForGame[this.currentQuestion].image}`;
  }

  async getAudio() {
    if (this.audio) {
      this.audio.nativeElement.src = `${BACKEND_PATH}/${this.wordsForGame[this.currentQuestion].audio}`;
      await this.audio.nativeElement.play();
    }
  }
}
