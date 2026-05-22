import { ISelectOption } from '../../selector.types';

type selectValue = {
  value: string[] | string;
  selectedOptions: string[];
  list: ISelectOption[];
  dontAllowEmptyValues: boolean;
};

export const selectValue = ({ value, selectedOptions, list, dontAllowEmptyValues }: selectValue): string[] => {
  const values = Array.isArray(value) ? value : [value];

  if (!values.length && list.length === 2 && dontAllowEmptyValues) {
    const auxValue = selectedOptions[0];
    const otherOptions = list.filter((item) => item.value.toString() !== auxValue.toString());
    const otherOption = [otherOptions[0].value];

    return otherOption;
  } else if (list.length === 1 && dontAllowEmptyValues) {
    const onlyOption = selectedOptions.length ? [selectedOptions[0].valueOf().toString()] : values;

    return onlyOption;
  }

  return values;
};
