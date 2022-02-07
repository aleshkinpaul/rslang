import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { GameType, IAggregatedResponseWord, IResults, IStatistic, IStatisticParam, IUserWord } from 'src/app/shared/interfaces';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private datePipe: DatePipe, private api: ApiService, private auth: AuthService,) { }

  setStatistic(words: IAggregatedResponseWord[], results: IResults[], gameType: GameType) {
    const date = this.datePipe.transform(new Date(), 'dd.MM.yyy')!;

    this.api.getStatistics(this.auth.userId).subscribe((response) => {
      const statistic: IStatistic = response;
      const newWords = (words as IAggregatedResponseWord[]).filter((word) => word.userWord).length;
      const correctAnswers = results.filter((word) => word.isCorrect).length;
      const wrongAnswers = results.filter((word) => !word.isCorrect).length;
      const correctSeries = this.getCorrectSeries(results);

      const newStat = {
        [date]: {
          newWords: newWords,
          correctAnswers: correctAnswers,
          wrongAnswers: wrongAnswers,
          correctSeries: correctSeries,
        }
      }

      if (statistic.optional.games[gameType]) {
        const newCorrectSeries = statistic.optional.games[gameType][date].correctSeries > correctSeries
          ? statistic.optional.games[gameType][date].correctSeries
          : correctSeries;

        (statistic.optional.games[gameType][date] as IStatisticParam) = {
          newWords: statistic.optional.games[gameType][date].newWords + newWords,
          correctAnswers: statistic.optional.games[gameType][date].correctAnswers + correctAnswers,
          wrongAnswers: statistic.optional.games[gameType][date].wrongAnswers + wrongAnswers,
          correctSeries: newCorrectSeries,
        }
      } else {
        statistic.optional.games[gameType] = newStat;
      }

      if (statistic.optional.words) {
        const newCorrectSeries = statistic.optional.words[date].correctSeries > correctSeries
          ? statistic.optional.words[date].correctSeries
          : correctSeries;

        (statistic.optional.words[date] as IStatisticParam) = {
          newWords: statistic.optional.words[date].newWords + newWords,
          correctAnswers: statistic.optional.words[date].correctAnswers + correctAnswers,
          wrongAnswers: statistic.optional.words[date].wrongAnswers + wrongAnswers,
          correctSeries: newCorrectSeries,
        }
      } else {
        statistic.optional.words = newStat;
      }
      delete statistic.id;
      this.api.upsertStatistics(this.auth.userId, statistic);
    });
  }

  addWordToUser(word: IAggregatedResponseWord, isUserRight: boolean) {
    if ((word as IAggregatedResponseWord).userWord) {
      const wordSettings = (word as IAggregatedResponseWord).userWord!;

      if (isUserRight) {
        wordSettings.optional.correctAnswers += 1;
        wordSettings.optional.correctSeries += 1;
      } else {
        wordSettings.optional.wrongAnswers += 1;
        wordSettings.optional.correctSeries = 0;
        wordSettings.optional.isStudied = false;
      }

      if (wordSettings.difficulty === 'hard') {
        wordSettings.difficulty = wordSettings.optional.correctSeries >= 5 ? 'easy' : 'hard';
        wordSettings.optional.isStudied = wordSettings.optional.correctSeries >= 5 ? true : false;
      } else {
        wordSettings.optional.isStudied = wordSettings.optional.correctSeries >= 3 ? true : false;
      }

      this.api.updateUserWord(this.auth.userId, (word as IAggregatedResponseWord)._id, wordSettings);
    } else {
      const wordSettings: IUserWord = {
        difficulty: 'easy',
        optional: {
          isStudied: false,
          correctAnswers: isUserRight ? 1 : 0,
          wrongAnswers: isUserRight ? 0 : 1,
          correctSeries: isUserRight ? 1 : 0,
        }
      }
      this.api.createUserWord(this.auth.userId, (word as IAggregatedResponseWord)._id, wordSettings);
    }
  }

  getCorrectSeries(results: IResults[]): number {
    let maxSeries = 0;

    results.forEach((result, i) => {
      let currentIndex = i;
      let count = 0;
      while (currentIndex < results.length && results[currentIndex].isCorrect) {
        count += 1;
        currentIndex += 1;
      }

      if (count > maxSeries) {
        maxSeries = count;
      }
    });

    return maxSeries;
  }
}
