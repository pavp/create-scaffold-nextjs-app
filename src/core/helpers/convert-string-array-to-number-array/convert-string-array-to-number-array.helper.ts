export const convertStringArrayToNumberArray = (stringArray: string[]): number[] =>
  stringArray.map((str) => Number(str));
