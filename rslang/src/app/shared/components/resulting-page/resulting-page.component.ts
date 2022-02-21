import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BACKEND_PATH } from 'src/app/core/constants/constant';

import { IResults } from '../../interfaces';

@Component({
  selector: 'app-resulting-page',
  templateUrl: './resulting-page.component.html',
  styleUrls: ['./resulting-page.component.scss'],
  animations: [
    trigger('enterLeave', [
      transition('void => *', [
        style({ opacity: 0.2, transform: 'translateY(-200%)' }),
        animate('1000ms ease-in'),
      ]),
    ]),
  ],
})
export class ResultingPageComponent implements OnInit {
@Input() resultsArray!: IResults[];
positiveResults:IResults[]=[];
negativeResults:IResults[]=[];

@Output() byPressCloseButton = new EventEmitter();
@ViewChild('audioPlayer', { static: false })
  audio: ElementRef | undefined;

  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.closeResults();

  }
  constructor() { }
  ngOnInit(): void {
    if (this.resultsArray){
      this.positiveResults=this.resultsArray.filter((el)=> el.isCorrect===true);
      this.negativeResults=this.resultsArray.filter((el)=> el.isCorrect===false);
    }
  }
  closeResults(){
this.byPressCloseButton.emit();
  }
  getAudio(audioPath:string){
    if (this.audio) {
      this.audio.nativeElement.src = `${BACKEND_PATH}/${
       audioPath
      }`;
    this.audio.nativeElement.play();
    }
  }


}
