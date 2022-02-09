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

  constructor() { }

  ngOnInit(): void {
  }

  getImage() {
    return `${BACKEND_PATH}/${this.wordData.image}`;
  }
}
