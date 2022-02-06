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
  group: string;
  page: string;
  wordsPerPage: string;
  filter: string;
}

export interface IUserWord {
  difficulty: WordDifficultyType;
  optional: {
    tempParam: string;
  };
}

export interface IStatistic {
  learnedWords: number;
  optional: {
    tempParam: string;
  };
}

export interface ISettings {
  wordsPerDay: number;
  optional: {
    tempParam: string;
  };
}
export interface IResults {
  word: IWord;
  isCorrect: boolean;
}
