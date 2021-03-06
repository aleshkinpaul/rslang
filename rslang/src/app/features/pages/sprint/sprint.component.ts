import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import {
  AGGREGATED_REQUESTS,
  BACKEND_PATH,
  DEFAULT_SPRINT_LEVEL,
  DEFAULT_SPRINT_PAGE,
  DEFAULT_SPRINT_TIME,
  LEVELS_IN_GAME,
  PAGES_IN_LEVEL,
  TIMES_TO_SPRINT,
  WORDS_IN_SPRINT_GAME,
  WORDS_ON_PAGE,
} from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SoundService } from 'src/app/core/services/sound.service';
import { StatisticService } from 'src/app/core/services/statistic.service';
import { Sounds } from 'src/app/core/utils/enum';
import { shuffleArr } from 'src/app/core/utils/utils';
import {
  IAggregatedResponseWord,
  IResults,
  IWord,
} from 'src/app/shared/interfaces';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss'],
})
export class SprintComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer', { static: false })
  audio: ElementRef | undefined;

  interval: ReturnType<typeof setInterval> | null = null;
  loadingProgress = false;
  showResultsPage = false;
  gameMode = false;
  selectedLevel = DEFAULT_SPRINT_LEVEL;
  selectedPage = DEFAULT_SPRINT_PAGE;
  selectedTime = DEFAULT_SPRINT_TIME;
  levelsInGame = new Array(LEVELS_IN_GAME);
  timesInGame = TIMES_TO_SPRINT;
  isUserRight = false;
  currentQuestion = 0;
  timeToEndGame = 0;
  currentTranslateVariant = 0;
  wordsForGame: IAggregatedResponseWord[] | IWord[] = [];
  results: IResults[] = [];
  showResultQuestion = false;
  randomWord!: IAggregatedResponseWord;

  @HostListener('window:keydown', ['$event'])
  handleKeyChoice(event: KeyboardEvent) {
    if (
      this.gameMode &&
      !this.loadingProgress

    ) {
      switch (event.key) {
        case 'ArrowLeft': {
          this.checkAnswer(false);
          break;
        }
        case 'ArrowRight': {
          this.checkAnswer(true);
          break;
        }
        case '0': {
          this.getAudio();
          break;
        }
      }
    }
  }

  constructor(
    private api: ApiService,
    public route: ActivatedRoute,
    private auth: AuthService,
    private stat: StatisticService,
    public sound: SoundService
  ) { }

  ngOnDestroy() {
    if (this.interval !== null) clearInterval(this.interval);
  }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      if (data['page']) this.startGameFromLearnbook(data);
    });
    this.results = [];
  }

  startGameFromLearnbook(data: Params) {
    this.wordsForGame = [];
    this.gameMode = true;
    this.loadingProgress = true;
    this.selectedLevel = Number(data['level'] - 1);
    this.selectedPage = Number(data['page'] - 1);


    if (this.auth.isAuthenticated) {
      const params = {
        group: this.selectedLevel,
        page: 0,
        wordsPerPage: 600,
        filter: AGGREGATED_REQUESTS.allUnstudiedWords,
      };
      this.api
        .getAllUserAggregatedWords(this.auth.userId, params)
        .subscribe((response) => {
          let needWords = response[0].paginatedResults.filter(
            (word) => word.page === this.selectedPage
          );

          if (needWords.length < 20) {
            const otherWords = response[0].paginatedResults.filter(
              (word) => word.page < this.selectedPage
            );
            const addWords = shuffleArr(<[]>otherWords).slice(
              0,
              20 - needWords.length
            );
            this.wordsForGame = shuffleArr(<[]>[...needWords, ...addWords]);
          } else {
            this.wordsForGame = shuffleArr(<[]>needWords);
          }

          this.randomWord = response[0].paginatedResults[this.getRandomNumber(response[0].paginatedResults.length - 1)];

          this.results = [];
          this.currentQuestion = 0;
          this.createTimer();
          this.getQuestion();
        });
    } else {
      this.api
        .getWords(this.selectedPage, this.selectedLevel)
        .subscribe((res) => {
          this.wordsForGame = shuffleArr(<[]>res);
          this.results = [];
          this.currentQuestion = 0;
          this.createTimer();
          this.getQuestion();
        });
    }
  }

  startGame() {
    this.wordsForGame = [];
    this.gameMode = true;
    this.loadingProgress = true;

    const needWords: IAggregatedResponseWord[] = [];
    const wordsReqParams: { word: number; page: number }[] = [];

    while (wordsReqParams.length < WORDS_IN_SPRINT_GAME) {
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
    if (this.auth.isAuthenticated) {
      const params = {
        group: this.selectedLevel,
        page: 0,
        wordsPerPage: 600,
        filter: AGGREGATED_REQUESTS.allWords,
      };
      this.api
        .getAllUserAggregatedWords(this.auth.userId, params)
        .subscribe((response) => {
          const responseWords = response[0].paginatedResults;

          wordsReqParams.forEach((el) => {
            const word = responseWords.filter(
              (word) =>
                word.group === this.selectedLevel && word.page === el.page
            )[el.word];
            needWords.push(word);
          });

          this.wordsForGame = needWords;

          this.results = [];
          this.currentQuestion = 0;
          this.createTimer();
          this.getQuestion();
        });
    } else {
      const observables: Observable<IWord>[] = [];
      wordsReqParams.forEach((el) => {
        observables.push(
          this.api.getWords(el.page, this.selectedLevel).pipe(
            map((gettingPage) => {
              return gettingPage[el.word];
            })
          )
        );
      });

      forkJoin<IWord[]>(observables).subscribe((res) => {
        this.wordsForGame = res;
        this.results = [];
        this.currentQuestion = 0;
        this.currentTranslateVariant = 0;
        this.createTimer();
        this.getQuestion();
      });
    }
  }

  async getQuestion() {
    this.currentTranslateVariant = this.getCurrentTranslateVariant();
    this.loadingProgress = false;
  }

  getCurrentTranslateVariant() {
    let wrongVariant: number;

    if (this.wordsForGame.length === 1) {
      this.randomWord = this.getRandomNumber(1) === 1 ? this.randomWord : <IAggregatedResponseWord>this.wordsForGame[0];
      return wrongVariant = 22;
    } else {
      do {
        wrongVariant = this.getRandomNumber(this.wordsForGame.length - 1);
      } while (wrongVariant === this.currentQuestion);
    }
    const variants = [this.currentQuestion, wrongVariant];
    return variants[this.getRandomNumber(variants.length - 1)];
  }

  createTimer() {
    if (this.interval !== null) clearInterval(this.interval);
    this.timeToEndGame = this.selectedTime;
    this.interval = setInterval(() => {
      if (this.timeToEndGame <= 0) {
        if (this.interval !== null) clearInterval(this.interval);
        this.showResults();
        this.gameMode = false;
      }
      this.timeToEndGame -= 1;
    }, 1000);
  }

  checkAnswer(isRight: boolean) {
    let isRightTranslate: boolean;
    if (!this.results[this.currentQuestion]) {
      if (this.wordsForGame.length === 1) {
        isRightTranslate = this.wordsForGame[0].word === this.randomWord.word;
      } else {
        isRightTranslate =
          this.currentQuestion === this.currentTranslateVariant;
      }

      if (isRightTranslate === isRight) {
        this.isUserRight = true;
        this.sound.play(Sounds.right);
      } else {
        this.isUserRight = false;
        this.sound.play(Sounds.wrong);
      }

      const result: IResults = {
        isCorrect: this.isUserRight,
        word: <IAggregatedResponseWord>this.wordsForGame[this.currentQuestion],
      };
      this.results.push(result);
      const word = this.wordsForGame[this.currentQuestion];
      if (this.auth.isAuthenticated) {
        this.stat.addWordToUser(
          word as IAggregatedResponseWord,
          this.isUserRight
        );
      }

      this.nextQuestion();
    }
  }

  nextQuestion() {
    if (this.currentQuestion + 1 === this.wordsForGame.length) {
      this.showResults();
      if (this.auth.isAuthenticated) {
        this.stat.setStatistic(
          this.wordsForGame as IAggregatedResponseWord[],
          this.results,
          'sprint'
        );
      }
      if (this.interval !== null) clearInterval(this.interval);
      this.interval = null;
      this.gameMode = false;
    } else {
      this.currentQuestion += 1;
      this.getQuestion();
    }
  }

  showResults() {
    this.showResultsPage = true;
    this.sound.play(Sounds.results);
  }

  getRandomNumber(n: number) {
    return Math.floor(Math.random() * (n + 1));
  }

  getImage() {
    return `${BACKEND_PATH}/${this.wordsForGame[this.currentQuestion].image}`;
  }

  async getAudio() {
    if (this.audio) {
      this.audio.nativeElement.src = `${BACKEND_PATH}/${this.wordsForGame[this.currentQuestion].audio
        }`;
      await this.audio.nativeElement.play();
    }
  }
  getAnswerResult(i: number) {
    if (this.results) {
      return this.results[i].isCorrect === true ? true : false;
    } else return false;
  }
}
