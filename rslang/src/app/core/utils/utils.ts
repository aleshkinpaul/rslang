export const shuffleArr = (array: []): [] => {
  const arrayShuffle: [] = [...array];
  for (let i = arrayShuffle.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayShuffle[i], arrayShuffle[j]] = [arrayShuffle[j], arrayShuffle[i]];
  }
  return arrayShuffle;
};
