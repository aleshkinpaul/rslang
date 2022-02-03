import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import {
  DEFAULT_SPRINT_LEVEL,
  LEVELS_IN_GAME,
  PAGES_IN_LEVEL,
  WORDS_IN_SPRINT_GAME,
  WORDS_ON_PAGE,
} from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { IResults, IWord } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss'],
})
export class SprintComponent implements OnInit {
  loadingProgress = false;
  showResultsPage = false;
  gameMode = false;
  selectedLevel = DEFAULT_SPRINT_LEVEL;
  levelsInGame = new Array(LEVELS_IN_GAME);
  isUserRight: string | null = null;
  currentQuestion = 0;
  options: IWord[] = [];
  wordsForGame: IWord[] = [];
  results: IResults[] = [];

  constructor(private api: ApiService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      console.log(data);
      if (data['page']) this.startGameFromLearnbook(data);
    });
    this.selectedLevel = DEFAULT_SPRINT_LEVEL;
    this.results = [];
  }

  startGameFromLearnbook(data: Params) {
    this.gameMode = true;
    this.api.getWords(data['page'], data['level']).subscribe((res) => {
      this.results = [];
      this.wordsForGame = res;
      this.currentQuestion = 0;
      this.selectedLevel = data['level'];
      console.log(this.wordsForGame);
    });
  }

  startGame() {
    this.gameMode = true;
    this.getRandomWordsForGame(WORDS_IN_SPRINT_GAME).subscribe((res) => {
      this.wordsForGame = res;
      this.results = [];
      this.currentQuestion = 0;
      console.log(this.wordsForGame);
    });
  }

  stopGame() {
    this.gameMode = false;
  }

  getRandomWordsForGame(wordsCount: number): Observable<IWord[]> {
    const observables: Observable<IWord>[] = [];
    const wordsReqParams: { word: number; page: number }[] = [];

    while (wordsReqParams.length < wordsCount) {
      const newReqParam = {
        word: this.getRandomNumber(WORDS_ON_PAGE),
        page: this.getRandomNumber(PAGES_IN_LEVEL),
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

  getRandomNumber(n: number) {
    return Math.floor(Math.random() * n);
  }
}
