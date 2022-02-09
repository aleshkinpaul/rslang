import { AfterContentChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { IWord } from 'src/app/shared/interfaces';

import { LEARNBOOK_WORDS_PER_GROUP_COUNT } from './../../../../core/constants/constant';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, AfterViewInit, AfterContentChecked {
  groupNum: number = 1;
  pageNums: Array<number> = [];
  currentPage!: number;
  wordsData?: IWord[];

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.groupNum = this.route.snapshot.params['id'];
    this.getCurrentPage();    
    this.getWords(this.currentPage);
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < LEARNBOOK_WORDS_PER_GROUP_COUNT; i++) this.pageNums.push(i + 1);
  }

  ngAfterContentChecked(): void {
    this.getCurrentPage();
  }

  getWords(pageNum: number) {
    this.apiService.getWords(pageNum, this.groupNum)
      .subscribe((res) => { this.wordsData = res; console.log(this.wordsData[0]) });
  }

  getCurrentPage() {
    this.currentPage = this.route.snapshot.queryParams['page'];
  }
}
