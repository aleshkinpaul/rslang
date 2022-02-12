import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { catchError, throwError } from 'rxjs';
import { DATE_PATTERN } from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { IChartData, IStatCardData, IStatistic, IUserWord } from 'src/app/shared/interfaces';
import { defineLordIconElement } from 'lord-icon-element';
import lottie from "lottie-web";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  isStatisticGet = false;
  isUserWordsGet = false;
  date: string = '';
  statistic!: IStatistic;
  userWords!: IUserWord[];
  sprintCardData: IStatCardData | null = null;
  audioCardData: IStatCardData | null = null;
  wordsCardData: IStatCardData | null = null;

  newWordsChartData: IChartData = {
    title: 'Количество новых слов',
    type: ChartType.ColumnChart,
  }

  studiedChartData: IChartData = {
    title: 'Количество изученных слов',
    type: ChartType.AreaChart,
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    defineLordIconElement(lottie.loadAnimation);
  }
  constructor(private api: ApiService, public auth: AuthService, private datePipe: DatePipe) {
    defineLordIconElement(lottie.loadAnimation);
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated) {
      this.date = this.datePipe.transform(new Date(), DATE_PATTERN)!;
      this.getStatistic();
      this.getUserWords();
    }
  }

  getStatistic() {
    this.api.getStatistics(this.auth.userId).pipe(
      catchError((error: HttpErrorResponse) => {
        this.isStatisticGet = true;
        return throwError(() => error);
      })
    ).subscribe((response) => {
      this.statistic = response;
      this.getSprintCardData();
      this.getAudioCardData();
      this.getWordsCardData();
      this.getNewWordsChart();
      this.getStudiedChart();
      this.isStatisticGet = true;
    });
  }

  getUserWords() {
    this.api.getAllUserWords(this.auth.userId).subscribe((response) => {
      this.userWords = response;
      this.isUserWordsGet = true;
    });
  }

  getSprintCardData() {
    if (this.statistic.optional.games && this.statistic.optional.games.sprint) {
      if (this.statistic.optional.games.sprint[this.date]) {
        const newWords = this.statistic.optional.games.sprint[this.date].newWords || 0;
        const correctSeries = this.statistic.optional.games.sprint[this.date].correctSeries || 0;
        const correctAnswers = this.statistic.optional.games.sprint[this.date].correctAnswers || 0;
        const wrongAnswers = this.statistic.optional.games.sprint[this.date].wrongAnswers || 0;
        const rightPercent = correctAnswers / (correctAnswers + wrongAnswers) * 100;

        this.sprintCardData = {
          newWords: newWords,
          correctSeries: correctSeries,
          rightPercent: Math.round(rightPercent),
        }
      }
    }
  }

  getAudioCardData() {
    if (this.statistic.optional.games && this.statistic.optional.games.audio) {
      if (this.statistic.optional.games.audio[this.date]) {
        const newWords = this.statistic.optional.games.audio[this.date].newWords || 0;
        const correctSeries = this.statistic.optional.games.audio[this.date].correctSeries || 0;
        const correctAnswers = this.statistic.optional.games.audio[this.date].correctAnswers || 0;
        const wrongAnswers = this.statistic.optional.games.audio[this.date].wrongAnswers || 0;
        const rightPercent = correctAnswers / (correctAnswers + wrongAnswers) * 100;

        this.audioCardData = {
          newWords: newWords,
          correctSeries: correctSeries,
          rightPercent: Math.round(rightPercent),
        }
      }
    }
  }

  getWordsCardData() {
    if (this.statistic.optional.words && this.statistic.optional.words[this.date]) {
      const newWords = this.statistic.optional.words[this.date].studiedWords || 0;
      const correctSeries = this.statistic.optional.words[this.date].correctSeries || 0;
      const correctAnswers = this.statistic.optional.words[this.date].correctAnswers || 0;
      const wrongAnswers = this.statistic.optional.words[this.date].wrongAnswers || 0;
      const rightPercent = correctAnswers / (correctAnswers + wrongAnswers) * 100;

      this.wordsCardData = {
        newWords: newWords,
        correctSeries: correctSeries,
        rightPercent: Math.round(rightPercent),
      }
    }
  }

  getNewWordsChart() {
    const data = Object.keys(this.statistic.optional.words).map((key) => [key, this.statistic.optional.words[key].newWords]);
    this.newWordsChartData.data = data;
  }

  getStudiedChart() {
    const data = Object.keys(this.statistic.optional.words).map((key) => [key, this.statistic.optional.words[key].studiedWords]);

    data.forEach((item, i) => {
      if (i > 0) {
        data[i][1] = Number(data[i][1] || 0) + Number(data[i - 1][1] || 0);
      } else {
        data[i][1] = Number(data[i][1] || 0);
      }
    });
    this.studiedChartData.data = data;

  }
}
