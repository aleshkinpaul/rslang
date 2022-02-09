import { Component, OnInit } from '@angular/core';

import { LEARNBOOK_GROUP_COUNT } from './../../../../core/constants/constant';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  groupNums: Array<number|string> = [];
  centered = false;
  disabled = false;
  unbounded = false;

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < LEARNBOOK_GROUP_COUNT + 1; i++) this.groupNums.push(i + 1);
  }
}
