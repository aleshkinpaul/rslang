import { animate, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { forkJoin, map, Observable } from 'rxjs';
import {
  LEVELS_IN_GAME,
  WORDS_IN_GAME_CHOICE,
  PAGES_IN_LEVEL,
  OPTIONS_IN_AUDIOCHALLENGE,
  BACKEND_PATH,
  WORDS_ON_PAGE,
  AGGREGATED_REQUESTS,
} from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StatisticService } from 'src/app/core/services/statistic.service';
import { shuffleArr } from 'src/app/core/utils/utils';
import { IWord, IResults, IAggregatedResponseWord } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-audio-challenge',
  templateUrl: './audio-challenge.component.html',
  styleUrls: ['./audio-challenge.component.scss'],
  animations: [
    trigger('enterLeave', [
      transition('void => *', [
        style({ opacity: 0.2, transform: 'scale(0)' }),
        animate('500ms ease-in'),
      ]),
    ]),
  ],
})
export class AudioChallengeComponent implements OnInit {
  @ViewChild('audioPlayer', { static: false })
  audio: ElementRef | undefined;
  @ViewChild('imageAnswer', { static: false })
  image: ElementRef | undefined;

  isBubble: boolean = true;
  loadingProgress: boolean = false;
  showResultsPage: boolean = false;
  learnBookMode: boolean = false;
  isUserRight: string | null = null;
  learnBookData: Params = {}
  gameMode = false;
  currentQuestion: number = 0;
  options: IWord[] | undefined = [];
  levelsInGame = new Array(LEVELS_IN_GAME);
  selectedLevel: number = 0;
  wordsForGame: IWord[] | IAggregatedResponseWord[] = [];
  results: IResults[] = [];
  selectedWordsAmount: number = 5;
  wordsAmountSlection = WORDS_IN_GAME_CHOICE;

  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isUserRight !== null) {
      this.nextQuestion();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyChoice(event: KeyboardEvent) {
    if (this.isUserRight === null && this.gameMode && this.options && this.loadingProgress) {
      switch (event.key) {
        case '1': {
          this.checkAnswer(this.options[0].word);
          break;
        }
        case '2': {
          this.checkAnswer(this.options[1].word);
          break;
        }
        case '3': {
          this.checkAnswer(this.options[2].word);
          break;
        }
        case '4': {
          this.checkAnswer(this.options[3].word);
          break;
        }
        case '5': {
          this.checkAnswer(this.options[4].word);
          break;
        }
        case '0': {
          this.getAudio();
          break;
        }
      }
    }
  }

  constructor(public server: ApiService, public route: ActivatedRoute, private auth: AuthService, private stat: StatisticService) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      if (data['page']) {
        this.learnBookMode = true;
        this.learnBookData = data;
      } else {
        this.selectedWordsAmount = 10;
        this.selectedLevel = 0;

      }
    });

    this.results = [];
  }

  returnToInitials() {
    this.gameMode = false;
    this.showResultsPage = false;
    this.results = [];


  }

  startGame() {
    this.gameMode = !this.gameMode;

    if (this.auth.isAuthenticated) {
      const needWords: IAggregatedResponseWord[] = [];
      const wordsReqParams: { word: number; page: number }[] = [];

      while (wordsReqParams.length < this.selectedWordsAmount) {
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

      const params = {
        group: this.selectedLevel,
        page: 0,
        wordsPerPage: 600,
        filter: AGGREGATED_REQUESTS.allUnstudiedWords,
      }
      this.server.getAllUserAggregatedWords(this.auth.userId, params).subscribe((response) => {
        const responseWords = response[0].paginatedResults;

        wordsReqParams.forEach((el) => {
          const word = responseWords.filter((word) => word.group === this.selectedLevel && word.page === el.page)[el.word];
          needWords.push(word);
        });

        this.wordsForGame = needWords;
        this.results = [];
        this.currentQuestion = 0;
        this.getQuestion();
      })
    } else {
      this.getRandomWordsForGame(this.selectedWordsAmount).subscribe((res) => {
        this.wordsForGame = res;
        this.results = [];
        this.currentQuestion = 0;
        this.getQuestion();
      });
    }
  }

  startFromLearnbook(data: Params) {
    this.gameMode = !this.gameMode;

    if (this.auth.isAuthenticated) {
      const params = {
        group: this.selectedLevel,
        page: 0,
        wordsPerPage: 600,
        filter: AGGREGATED_REQUESTS.allUnstudiedWords,
      }
      this.server.getAllUserAggregatedWords(this.auth.userId, params).subscribe((response) => {
        let needWords = response[0].paginatedResults.filter((word) => word.page === data['page']);

        if (needWords.length < 20) {
          const otherWords = response[0].paginatedResults.filter((word) => word.page !== data['page']);
          const addWords = shuffleArr(<[]>otherWords).slice(0, 20 - needWords.length);
          this.wordsForGame = shuffleArr(<[]>[...needWords, ...addWords]);
        } else {
          this.wordsForGame = shuffleArr(<[]>needWords);
        }

        this.results = [];
        this.currentQuestion = 0;
        this.selectedLevel = data['level'];
        this.getQuestion();
      });
    } else {
      this.server.getWords(data['page'], data['level']).subscribe((res) => {
        this.results = [];
        this.wordsForGame = res;
        this.wordsForGame.sort(() => 0.5 - Math.random())
        this.currentQuestion = 0;
        this.selectedLevel = data['level'];
        this.getQuestion();
      })
    }
  }

  async getQuestion() {
    await this.getOptions();
    await this.getAudio();
    this.loadingProgress = true;
  }

  async getOptions() {
    do {
      this.options = [];
      this.options = await this.getRandomWordsForGame(OPTIONS_IN_AUDIOCHALLENGE - 1).toPromise()
      if (this.options) {
        this.options.push(this.wordsForGame[this.currentQuestion] as IWord);
        this.options.sort(() => 0.5 - Math.random());
      }
    } while (this.checkDoubles());
  }

  checkDoubles(): boolean {
    const words: string[] = [];
    if (this.options) {
      this.options.forEach((el) => words.push(el.word));
      return (
        words.filter((pos, index) => words.indexOf(pos) !== index).length > 0
      );
    } else return false;
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

  checkAnswer(wordChoosed: string) {
    if (wordChoosed === this.wordsForGame[this.currentQuestion].word) {
      this.isUserRight = 'true';
    } else this.isUserRight = 'false';
    const result: IResults = {
      isCorrect: this.isUserRight === 'true' ? true : false,
      word: this.wordsForGame[this.currentQuestion] as IWord,
    };
    this.results.push(result);
    const word = this.wordsForGame[this.currentQuestion];
    if (this.auth.isAuthenticated) {
      this.stat.addWordToUser(word as IAggregatedResponseWord, this.isUserRight === 'true' ? true : false);
    }
  }

  nextQuestion() {
    this.isUserRight = null;
    this.options = [];
    if (this.currentQuestion + 1 === this.wordsForGame.length) {
      this.showResults();
      if (this.auth.isAuthenticated) {
        this.stat.setStatistic(this.wordsForGame as IAggregatedResponseWord[], this.results, 'audio');
      }
      this.gameMode = !this.gameMode;
    } else {
      this.currentQuestion++;
      this.loadingProgress = false;
      this.getQuestion();
    }
  }

  showResults() {
    this.showResultsPage = true;
  }

  getRandomWordsForGame(n: number): Observable<IWord[]> {
    let observables: Observable<IWord>[] = [];
    for (let i = 0; i < n; i++) {
      observables.push(
        this.server
          .getWords(this.getRandomNumber(PAGES_IN_LEVEL), this.selectedLevel)
          .pipe(
            map((el) => {
              return el[this.getRandomNumber(WORDS_ON_PAGE)];
            })
          )
      );
    }
    return forkJoin<IWord[]>(observables);
  }
  getAnswerResult(i:number){
    if (this.results) {
    return (this.results[i].isCorrect===true) ? true : false;
    } else return false;
  }
  getRandomNumber(n: number) {
    return Math.floor(Math.random() * n);
  }
}
