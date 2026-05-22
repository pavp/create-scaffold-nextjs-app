export const getFirstItemFromArray = (array: string[]): string | undefined => {
  if (array?.length) return array[0];

  return undefined;
};
