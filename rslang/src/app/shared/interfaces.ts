type WordDifficultyType = 'easy' | 'hard';

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface IUserCreate {
  name: string;
  email: string;
  id: string;
}

export interface IUserData {
  email: string;
  password: string;
}

export interface IAuth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
  avatar?: string;
}

export interface IRefreshAuth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface IAggregatedRequestParams {
  group: number;
  page: number;
  wordsPerPage: number;
  filter: string;
}

export interface IUserWord {
  difficulty: WordDifficultyType;
  optional: {
    isStudied: boolean;
    correctAnswers: number;
    wrongAnswers: number;
    correctSeries: number;
  };
}

export interface IStatisticParam {
  newWords: number;
  correctAnswers: number;
  wrongAnswers: number;
  correctSeries: number;
}

export interface IStatisticWordsParam {
  newWords: number;
  correctAnswers: number;
  wrongAnswers: number;
  correctSeries: number;
  studiedWords: number;
}

export interface IStatistic {
  id?: string;
  learnedWords: number;
  optional: {
    games: {
      audio: {
        [key: string]: IStatisticParam;
      };
      sprint: {
        [key: string]: IStatisticParam;
      };
    };
    words: {
      [key: string]: IStatisticWordsParam;
    };
  }
}

export interface ISettings {
  wordsPerDay: number;
  optional: {
    tempParam: string;
  };
}

export interface IResults {
  word: IAggregatedResponseWord;
  isCorrect: boolean;
}

export interface IAggregatedResponseWord {
  _id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  userWord?: IUserWord;
}

export interface IAggregatedResponseWords {
  paginatedResults: IAggregatedResponseWord[];
  totalCount: {
    count: number;
  }[]
}

export type GameType = 'sprint' | 'audio';

export interface IStatCardData {
  newWords: number;
  rightPercent: number;
  correctSeries: number;
}

export interface ILearnbookParams {
  group?: number;
  page?: number;
}
