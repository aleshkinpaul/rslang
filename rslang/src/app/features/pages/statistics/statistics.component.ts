import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { DATE_PATTERN } from 'src/app/core/constants/constant';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { IChartData, IStatCardData, IStatistic, IUserWord } from 'src/app/shared/interfaces';

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

  constructor(private api: ApiService, public auth: AuthService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated) {
      this.date = this.datePipe.transform(new Date(), DATE_PATTERN)!;
      this.getStatistic();
      this.getUserWords();
    }
  }

  getStatistic() {
    this.api.getStatistics(this.auth.userId).subscribe((response) => {
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
        const newWords = this.statistic.optional.games.sprint[this.date].newWords;
        const correctSeries = this.statistic.optional.games.sprint[this.date].correctSeries;
        const correctAnswers = this.statistic.optional.games.sprint[this.date].correctAnswers;
        const wrongAnswers = this.statistic.optional.games.sprint[this.date].wrongAnswers;
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
        const newWords = this.statistic.optional.games.audio[this.date].newWords;
        const correctSeries = this.statistic.optional.games.audio[this.date].correctSeries;
        const correctAnswers = this.statistic.optional.games.audio[this.date].correctAnswers;
        const wrongAnswers = this.statistic.optional.games.audio[this.date].wrongAnswers;
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
      const newWords = this.statistic.optional.words[this.date].studiedWords;
      const correctSeries = this.statistic.optional.words[this.date].correctSeries;
      const correctAnswers = this.statistic.optional.words[this.date].correctAnswers;
      const wrongAnswers = this.statistic.optional.words[this.date].wrongAnswers;
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
        data[i][1] = Number(data[i][1]) + Number(data[i - 1][1]);
      }
    });
    this.studiedChartData.data = data;
  }
}
