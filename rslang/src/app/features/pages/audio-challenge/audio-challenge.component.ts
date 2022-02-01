import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

import { forkJoin, map, Observable, of } from 'rxjs';
import {
  LEVELS_IN_GAME,
  WORDS_IN_GAME,
  PAGES_IN_LEVEL,
  OPTIONS_IN_AUDIOCHALLENGE,
  BACKEND_PATH,
  WORDS_ON_PAGE
} from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { IWord, IResults } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-audio-challenge',
  templateUrl: './audio-challenge.component.html',
  styleUrls: ['./audio-challenge.component.scss'],
})
export class AudioChallengeComponent implements OnInit {
  @ViewChild('audioPlayer', { static: false })
  audio: ElementRef | undefined;
  @ViewChild('imageAnswer', { static: false })
  image: ElementRef | undefined;

  currentQuestion: number;
  loadingProgress: boolean = false;
  isUserRight: string | null = null;
  showResultsPage: boolean=false;
  options: IWord[] = [];
  levelsInGame = new Array(LEVELS_IN_GAME);
  selectedLevel: number = 0;
  selectedPage: number = 0;
  wordsForGame: IWord[] = [];
  results:IResults[]=[];
  gameMode = false;

  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isUserRight!==null){
      this.nextQuestion();
    }
  }
    @HostListener('window:keydown', ['$event'])
  handleKeyChoice(event: KeyboardEvent) {
    if (this.isUserRight===null&&this.gameMode){

    }

  }
  constructor(public server: ApiService) {
    this.currentQuestion = 0;
  }
  ngOnInit(): void {
    this.selectedLevel = 0;
    this.selectedPage = 0;
    this.results=[];
  }
  startGame() {
    this.gameMode = !this.gameMode;
    this.getRandomWordsForGame(WORDS_IN_GAME).subscribe((res) => {
      this.wordsForGame = res;
      this.results=[];
      this.currentQuestion=0;
      console.log(this.wordsForGame);
      this.getQuestion();
    });
  }
  getQuestion() {
    this.getOptions();
    this.getAudio();
  }
  getOptions() {
    do{
      this.options = [];
    this.getRandomWordsForGame(OPTIONS_IN_AUDIOCHALLENGE - 1).subscribe(
      (res) => {
        this.options = res;
        this.options.push(this.wordsForGame[this.currentQuestion]);
        this.options.sort(() => 0.5 - Math.random());
      }
    );
    } while(this.options.filter((pos, index)=> this.options.indexOf(pos)!==index).length)
  }
  getImage() {
    return `${BACKEND_PATH}/${this.wordsForGame[this.currentQuestion].image}`;
  }
  getAudio() {
    if (this.audio) {
      this.audio.nativeElement.src = `${BACKEND_PATH}/${
        this.wordsForGame[this.currentQuestion].audio
      }`;
    this.audio.nativeElement.play()
     this.loadingProgress=true

    }
  }
  checkAnswer(wordChoosed: string) {
    if (wordChoosed === this.wordsForGame[this.currentQuestion].word) {
      this.isUserRight = 'true';
    } else this.isUserRight = 'false';
    const result:IResults={
      isCorrect:(this.isUserRight==='true') ? true : false,
      word:this.wordsForGame[this.currentQuestion]
    }
    this.results.push(result)

  }
  nextQuestion() {
    this.isUserRight = null;
    this.options=[];
    if (this.currentQuestion + 1===this.wordsForGame.length) {
      this.showResults();
      this.gameMode=!this.gameMode;
    } else {
      this.currentQuestion++;
      this.loadingProgress = false;
      this.getQuestion();
    }

  }
  showResults(){
    this.showResultsPage=true;
    console.log(this.results)
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

  getRandomNumber(n: number) {
    return Math.floor(Math.random() * n);
  }
}
