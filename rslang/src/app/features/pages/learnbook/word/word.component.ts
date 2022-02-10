import { Component, Input, OnInit } from '@angular/core';
import { IWord } from 'src/app/shared/interfaces';
import { BACKEND_PATH } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  @Input() wordData!: IWord;
  wordCardContentText: string = '';
  isMeaningShow: boolean = false;
  isExampleShow: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  getImage() {
    return `${BACKEND_PATH}/${this.wordData.image}`;
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
}
