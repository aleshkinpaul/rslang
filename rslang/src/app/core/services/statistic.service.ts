import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { GameType, IAggregatedResponseWord, IResults, IStatistic, IStatisticParam, IStatisticWordsParam, IUserWord } from 'src/app/shared/interfaces';
import { DATE_PATTERN } from '../constants/constant';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private datePipe: DatePipe, private api: ApiService, private auth: AuthService) { }

  setStatistic(words: IAggregatedResponseWord[], results: IResults[], gameType: GameType) {
    const date = this.datePipe.transform(new Date(), DATE_PATTERN)!;
    const newWords = words.filter((word) => !word.userWord).length;
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

    this.api.getStatistics(this.auth.userId).pipe(
      catchError((error: HttpErrorResponse) => {
        const stat = {
          learnedWords: 0,
          optional: {
            games: {
              audio: {},
              sprint: {},
            },
            words: {},
          }
        }

        stat.optional.games[gameType] = newStat;
        stat.optional.words = newStat;

        this.api.upsertStatistics(this.auth.userId, stat).subscribe((response) => { });
        return throwError(() => error);
      })
    ).subscribe((response) => {
      const statistic: IStatistic = response;

      if (!statistic.optional.hasOwnProperty('games')) {
        const addOptional = {
          games: {
            [gameType]: newStat,
          }
        };
        statistic.optional = Object.assign(statistic.optional, addOptional);
      } else if (statistic.optional.games.hasOwnProperty(gameType) && statistic.optional.games[gameType][date]) {
        const newCorrectSeries = statistic.optional.games[gameType][date].correctSeries > correctSeries
          ? statistic.optional.games[gameType][date].correctSeries
          : correctSeries;

        (statistic.optional.games[gameType][date] as IStatisticParam) = {
          newWords: statistic.optional.games[gameType][date].newWords + newWords,
          correctAnswers: statistic.optional.games[gameType][date].correctAnswers + correctAnswers,
          wrongAnswers: statistic.optional.games[gameType][date].wrongAnswers + wrongAnswers,
          correctSeries: newCorrectSeries,
        }
      } else if (statistic.optional.games.hasOwnProperty(gameType)) {
        statistic.optional.games[gameType] = Object.assign(statistic.optional.games[gameType], newStat);
      } else {
        statistic.optional.games[gameType] = newStat;
      }

      if (statistic.optional.words[date]) {
        const newCorrectSeries = statistic.optional.words[date].correctSeries > correctSeries
          ? statistic.optional.words[date].correctSeries
          : correctSeries;

        const studiedWords = this.getStudiedWordsCount(results);

        (statistic.optional.words[date] as IStatisticWordsParam) = {
          newWords: statistic.optional.words[date].newWords + newWords,
          correctAnswers: statistic.optional.words[date].correctAnswers + correctAnswers,
          wrongAnswers: statistic.optional.words[date].wrongAnswers + wrongAnswers,
          correctSeries: newCorrectSeries,
          studiedWords: statistic.optional.words[date].studiedWords + studiedWords,
        }
      } else {
        statistic.optional.words = Object.assign(statistic.optional.words, newStat);
        statistic.optional.words[date].studiedWords = this.getStudiedWordsCount(results);
      }

      delete statistic.id;
      console.log('sss', statistic);


      this.api.upsertStatistics(this.auth.userId, statistic).subscribe(() => { });
    });
  }

  getStudiedWordsCount(results: IResults[]): number {
    const newWordsCount = results.reduce((count, wordResult) => {
      if (wordResult.isCorrect && wordResult.word.userWord) {

        if (wordResult.word.userWord.difficulty === 'hard') {
          count += wordResult.word.userWord.optional.correctSeries === 5 ? 1 : 0;
        } else {
          count += wordResult.word.userWord.optional.correctSeries === 3 ? 1 : 0;
        }

      }
      return count;
    }, 0);

    return newWordsCount;
  }

  addWordToUser(word: IAggregatedResponseWord, isUserRight: boolean) {
    if (word.userWord) {
      const wordSettings = word.userWord;

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

      this.api.updateUserWord(this.auth.userId, word._id, wordSettings).subscribe((res) => { });
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

      this.api.createUserWord(this.auth.userId, word._id, wordSettings).subscribe((res) => { });
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

  changeStudiedWordCount(changeCount: number) {
    const date = this.datePipe.transform(new Date(), DATE_PATTERN)!;

    const newStat = {
      [date]: {
        newWords: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        correctSeries: 0,
        studiedWords: changeCount,
      }
    }

    this.api.getStatistics(this.auth.userId).pipe(
      catchError((error: HttpErrorResponse) => {
        const stat = {
          learnedWords: 0,
          optional: {
            games: {
              audio: {},
              sprint: {},
            },
            words: {},
          }
        }

        stat.optional.words = newStat;

        this.api.upsertStatistics(this.auth.userId, stat).subscribe((response) => { });
        return throwError(() => error);
      })
    ).subscribe((response) => {
      const statistic: IStatistic = response;

      if (statistic.optional.words[date]) {
        console.log('6666ssstat', statistic.optional.words[date].studiedWords, changeCount);

        statistic.optional.words[date].studiedWords = !statistic.optional.words[date].studiedWords
          ? changeCount
          : statistic.optional.words[date].studiedWords + changeCount;
        console.log('111ssstat', statistic);
      } else {
        statistic.optional.words = Object.assign(statistic.optional.words, newStat);
        console.log('222ssstat', statistic);
      }

      delete statistic.id;

      this.api.upsertStatistics(this.auth.userId, statistic).subscribe(() => { });
    });
  }
}
