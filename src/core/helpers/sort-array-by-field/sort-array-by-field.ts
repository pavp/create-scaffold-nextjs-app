/**
 * sortArrayByField
 * Orders and returns an object array by the desired field
 *
 * @param Array<Record<string, any>> array
 * @param String field
 * @param Boolean asc
 *
 * @returns Array<Record<string, any>>
 */
export const sortArrayByField = (
  array: Array<Record<string, any>>,
  field: string,
  asc: boolean = true,
): Array<Record<string, any>> => {
  return array.sort((a, b) => {
    const positionA = a[field];
    const positionB = b[field];

    if (positionA < positionB) {
      return asc ? -1 : 1;
    }
    if (positionA > positionB) {
      return asc ? 1 : -1;
    }

    return 0;
  });
};
