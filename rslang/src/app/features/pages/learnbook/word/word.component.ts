import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IWord } from 'src/app/shared/interfaces';
import { BACKEND_PATH } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  @Input() wordData!: IWord;
  @Output() onClickAudio: EventEmitter<string[]> = new EventEmitter<string[]>();
  
  wordCardContentText: string = '';
  wordAudioSrcArr!: Array<string>;
  currentAudioInd: number = 0;
  isMeaningShow: boolean = false;
  isExampleShow: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.wordAudioSrcArr = [this.wordData.audio, this.wordData.audioMeaning, this.wordData.audioExample];
    this.wordAudioSrcArr = this.wordAudioSrcArr.map(src => this.getAudio(src));
  }

  getImage() {
    return `${BACKEND_PATH}/${this.wordData.image}`;
  }

  getAudio(link: string) {
    return `${BACKEND_PATH}/${link}`;
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
    this.onClickAudio.emit(this.wordAudioSrcArr);
  }
}
