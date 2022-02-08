export const BACKEND_PATH = 'https://rslang-back-app.herokuapp.com';
export const EXP_TIME = 14400000;
export const ERROR_MESSAGE = {
  login: 'Неверный Email или пароль',
  updateLogin: 'Токен отсутствует, истек или недействителен',
  unauthorized: 'Пользователь не авторизован',
  create: 'Пользователь с таким email уже существует',
}

export const AGGREGATED_REQUESTS = {
  allUnstudiedWords: '{"$or":[{"userWord.optional.isStudied":false},{"userWord":null}]}',
}

export const LEVELS_IN_GAME = 6;
export const PAGES_IN_LEVEL = 30;
export const WORDS_IN_GAME = 10;
export const WORDS_ON_PAGE = 20;
export const WORDS_IN_GAME_CHOICE = [5, 10, 15, 20, 25, 30]
export const OPTIONS_IN_AUDIOCHALLENGE = 5;
export const REFRESH_TIME = 300000;
export const DEFAULT_SPRINT_LEVEL = 0;
export const WORDS_IN_SPRINT_GAME = 20;
export const TIMES_TO_SPRINT = [30, 60, 90];
export const DEFAULT_SPRINT_TIME = 60;
export const TIME_TO_SHOW_SPRINT_QUESTION_RESULT = 1000;
export const UPLOAD_IMAGES_PATH = 'https://api.cloudinary.com/v1_1/rslang-media/image/upload';
export const UPLOAD_IMAGES_PRESET = 'hbkvusoj';
export const DEFAULT_SPRINT_PAGE = 0;
export const DATE_PATTERN = 'dd.MM.yyyy';
