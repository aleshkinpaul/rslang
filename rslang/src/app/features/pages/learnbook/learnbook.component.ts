import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { IAggregatedResponseWord, ILearnbookParams, IWord } from 'src/app/shared/interfaces';

import { LEARNBOOK_PAGES_PER_GROUP_COUNT, LEARNBOOK_GROUP_COUNT, LEARNBOOK_WORDS_PER_PAGE_COUNT, LEARNBOOK_WORDS_COUNT } from './../../../core/constants/constant';

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
  wordsData!: (IAggregatedResponseWord | IWord)[];
  isLoggedIn: boolean = false;
  audio: HTMLAudioElement = new Audio();

  constructor(private route: ActivatedRoute, private apiService: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.userId;
    this.route.queryParams.subscribe((params: ILearnbookParams) => {
      this.currentGroupNum = Number(params['group']) || 0;
      this.currentPageNum = Number(params['page']) || 0;
      this.getWords();
    })
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < LEARNBOOK_GROUP_COUNT + 1; i++) this.groupNums.push(i + 1);
    for (let i = 0; i < LEARNBOOK_PAGES_PER_GROUP_COUNT; i++) this.pageNums.push(i + 1);
  }

  getWords() {
    if (this.isLoggedIn && (this.currentGroupNum === LEARNBOOK_GROUP_COUNT + 1)) {
      this.apiService.getAllUserAggregatedWords(this.authService.userId, {
        wordsPerPage: LEARNBOOK_WORDS_COUNT,
        filter: '{"userWord.difficulty":"hard"}',
      })
        .subscribe((res) => this.wordsData = res[0].paginatedResults); 
    }
    else if (this.isLoggedIn && (this.currentGroupNum >= 0 || this.currentPageNum >= 0)) {
      this.apiService.getAllUserAggregatedWords(this.authService.userId, {
        group: this.currentGroupNum - 1,
        page: this.currentPageNum - 1,
        wordsPerPage: LEARNBOOK_WORDS_PER_PAGE_COUNT,
      })
        .subscribe((res) => this.wordsData = res[0].paginatedResults); 
    }
    else this.apiService.getWords(this.currentPageNum - 1, this.currentGroupNum - 1)
      .subscribe((res) => this.wordsData = res); 
  }

  playWordAudio(wordAudioSrcArr: string[]) {
    let audioInd = 0;
    this.audio.src = wordAudioSrcArr[0];
    this.audio.load();
    this.audio.play();

    this.audio.onended = () => {
      audioInd++;
      if (audioInd < wordAudioSrcArr.length) {
        this.audio.src = wordAudioSrcArr[audioInd];
        this.audio.play();
      }
    }
  }
}
