import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { IAggregatedResponseWord, ILearnbookParams, IPageDetails, IWord } from 'src/app/shared/interfaces';

import { LEARNBOOK_PAGES_PER_GROUP_COUNT, LEARNBOOK_GROUP_COUNT, LEARNBOOK_WORDS_PER_PAGE_COUNT, LEARNBOOK_WORDS_COUNT } from './../../../core/constants/constant';

@Component({
  selector: 'app-learnbook',
  templateUrl: './learnbook.component.html',
  styleUrls: ['./learnbook.component.scss']
})
export class LearnbookComponent implements OnInit, AfterViewInit {
  groupNums: Array<number|string> = [];
  pagesDetails: IPageDetails[] = [];
  centered = false;
  disabled = false;
  unbounded = false;
  learnbookGroupCount: number = LEARNBOOK_GROUP_COUNT;
  currentGroupNum!: number;
  currentPageNum!: number;
  wordsData!: (IAggregatedResponseWord | IWord)[];
  isLoggedIn: boolean = false;
  audio: HTMLAudioElement = new Audio();

  constructor(private route_activated: ActivatedRoute, public route: Router, private apiService: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.userId;
    this.route_activated.queryParams.subscribe((params: ILearnbookParams) => {
      this.currentGroupNum = Number(params['group']) || 0;
      this.currentPageNum = Number(params['page']) || 0;
      this.getWords();
    })
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < LEARNBOOK_GROUP_COUNT + 1; i++) this.groupNums.push(i + 1);
  }

  getWords() {
    if (this.isLoggedIn && (this.currentGroupNum === LEARNBOOK_GROUP_COUNT + 1)) {
      this.apiService.getAllUserAggregatedWords(this.authService.userId, {
        wordsPerPage: LEARNBOOK_WORDS_COUNT,
        filter: '{"userWord.difficulty":"hard"}',
      })
        .subscribe((res) => this.wordsData = res[0].paginatedResults); 
    }
    else if (this.isLoggedIn && (this.currentGroupNum > 0 || this.currentPageNum > 0)) {
      this.apiService.getAllUserAggregatedWords(this.authService.userId, {
        group: this.currentGroupNum - 1,
        wordsPerPage: LEARNBOOK_WORDS_PER_PAGE_COUNT * LEARNBOOK_PAGES_PER_GROUP_COUNT,
      })
        .subscribe((res) => {
          this.wordsData = res[0].paginatedResults.filter(word => word.page === this.currentPageNum - 1);
          
          for (let i = 0; i < LEARNBOOK_PAGES_PER_GROUP_COUNT; i++) {
            const isPageStudied = res[0].paginatedResults.filter(word => word.page === i && ( word.userWord?.optional.isStudied || word.userWord?.difficulty === 'hard')).length === LEARNBOOK_WORDS_PER_PAGE_COUNT;
            const newPageDetail: string = JSON.stringify({
              num: i + 1,
              isStudied: isPageStudied,
            });

            if (i < this.pagesDetails.length) this.pagesDetails[i] = JSON.parse(newPageDetail)
            else this.pagesDetails.push(JSON.parse(newPageDetail));
          };
        });
    }
    else this.apiService.getWords(this.currentPageNum - 1, this.currentGroupNum - 1)
      .subscribe((res) => this.wordsData = res);
  }

  getStudiedPages() {
    this.apiService.getAllUserAggregatedWords(this.authService.userId, {
      group: this.currentGroupNum - 1,
      wordsPerPage: LEARNBOOK_WORDS_PER_PAGE_COUNT * LEARNBOOK_PAGES_PER_GROUP_COUNT,
    }).subscribe((res) => {
      for (let i = 0; i < LEARNBOOK_PAGES_PER_GROUP_COUNT; i++) {
        const newPageDetail: string = JSON.stringify({
          num: i + 1,
          isStudied: res[0].paginatedResults.filter(word => word.page === i && ( word.userWord?.optional.isStudied || word.userWord?.difficulty === 'hard')).length === LEARNBOOK_WORDS_PER_PAGE_COUNT,
        });

        if (i < this.pagesDetails.length) this.pagesDetails[i] = JSON.parse(newPageDetail)
        else this.pagesDetails.push(JSON.parse(newPageDetail));
      };
    })
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

  startAudioChallenge() {
    if (this.currentGroupNum > 0 && this.currentGroupNum <= LEARNBOOK_GROUP_COUNT && this.currentPageNum > 0)
      this.route.navigate(['/audiochallenge', { page: this.currentPageNum - 1, level: this.currentGroupNum - 1 }]);
  };

  startSprint() {
    if (this.currentGroupNum > 0 && this.currentGroupNum <= LEARNBOOK_GROUP_COUNT && this.currentPageNum > 0)
    this.route.navigate(['/sprint', { page: this.currentPageNum, level: this.currentGroupNum }]);
  };
}
