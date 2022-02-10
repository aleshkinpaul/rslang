import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { ILearnbookParams, IWord } from 'src/app/shared/interfaces';

import { LEARNBOOK_WORDS_PER_GROUP_COUNT, LEARNBOOK_GROUP_COUNT } from './../../../core/constants/constant';

@Component({
  selector: 'app-learnbook',
  templateUrl: './learnbook.component.html',
  styleUrls: ['./learnbook.component.scss']
})
export class LearnbookComponent implements OnInit, AfterViewInit {
  groupNums: Array<number|string> = [];
  pageNums: Array<number> = [];
  centered = false;
  disabled = false;
  unbounded = false;
  learnbookGroupCount: number = LEARNBOOK_GROUP_COUNT;
  currentGroupNum!: number;
  currentPageNum!: number;
  wordsData?: IWord[];

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe((params: ILearnbookParams) => {
      this.currentGroupNum = Number(params['group']) || 0;
      this.currentPageNum = Number(params['page']) || 0;
      this.getWords();
    })
    console.log(this.route.snapshot, this.currentGroupNum, this.currentPageNum);
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < LEARNBOOK_GROUP_COUNT + 1; i++) this.groupNums.push(i + 1);
    for (let i = 0; i < LEARNBOOK_WORDS_PER_GROUP_COUNT; i++) this.pageNums.push(i + 1);
    console.log(1);
  }

  getWords() {
    if (this.currentGroupNum >= 0 || this.currentPageNum >= 0) {
      this.apiService.getWords(this.currentPageNum - 1, this.currentGroupNum - 1)
        .subscribe((res) => { this.wordsData = res; console.log(this.wordsData[0]) });
    }
  }
}
