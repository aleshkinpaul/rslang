import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';
import { LEVELS_IN_GAME, WORDS_IN_GAME, PAGES_IN_LEVEL, OPTIONS_IN_AUDIOCHALLENGE, BACKEND_PATH } from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { IWord } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-audio-challenge',
  templateUrl: './audio-challenge.component.html',
  styleUrls: ['./audio-challenge.component.scss'],
})
export class AudioChallengeComponent implements OnInit {
  @ViewChild("audioPlayer", {static:false})
  audio:ElementRef|undefined;

  currentQuestion:number;
  options:IWord[]=[];
  levelsInGame = new Array(LEVELS_IN_GAME);
  selectedLevel: number = 0;
  selectedPage: number = 0;
  wordsForGame: IWord[] = [];
  gameMode = false;
  constructor(public server: ApiService) {
    this.currentQuestion = 0;
  }
  ngOnInit(): void {
    this.selectedLevel = 0;
    this.selectedPage = 0;
  }
  startGame() {
    this.gameMode = !this.gameMode;
    this.getRandomWordsForGame(WORDS_IN_GAME).subscribe((res)=> {

    this.wordsForGame=res;
    console.log(this.wordsForGame)
    this.getQuestion();
    });
  }
  getQuestion(){
  this.getOptions();
  this.getAudio();
  }
  getOptions(){
  this.getRandomWordsForGame(OPTIONS_IN_AUDIOCHALLENGE - 1).subscribe((res)=> {
    this.options = res;
    this.options.push(this.wordsForGame[this.currentQuestion]);
    console.log(this.currentQuestion)
    console.log(this.wordsForGame[this.currentQuestion])
    this.options.sort(()=> 0.5 - Math.random())
    console.log(this.options)
  })
  }
  getAudio(){
if (this.audio){
  this.audio.nativeElement.src=`${BACKEND_PATH}/${this.wordsForGame[this.currentQuestion].audio}`
  this.audio.nativeElement.play();
}
  }
  getRandomWordsForGame(n:number):Observable<IWord[]>{
    let observables:Observable<IWord>[]=[];
    for (let i=0; i< n; i++){
      observables.push(this.server.getWords(this.getRandomNumber(PAGES_IN_LEVEL), this.selectedLevel).pipe(
        map((el) => {
         return  el[this.getRandomNumber(WORDS_IN_GAME)];
        })))
    }
    return forkJoin<IWord[]>(
      observables
    )
  }

  getRandomNumber(n:number) {
    return Math.floor(Math.random() * n);
  }
}
