export const formatTwoDigitsNumber = (value: string | Number): string => {
  const parsedNumber = value.toString().padStart(2, '0');

  return parsedNumber;
};
