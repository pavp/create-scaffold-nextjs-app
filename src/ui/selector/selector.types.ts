import { Control, FieldValues, Path, UseFormClearErrors } from 'react-hook-form';

export interface ISelectOption {
  key: string;
  value: string;
  label: string;
}

export interface ISelector<T extends FieldValues> {
  classNameMainContainer?: string;
  defaultValues?: string[];
  dontAllowEmptyValues?: boolean;
  list: ISelectOption[];
  multiple?: boolean;
  control?: Control<T, any>;
  name: Path<T>;
  needsTranslation?: boolean;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
  width?: string;
  error?: boolean;
  messageError?: string;
  disabled?: boolean;
  label?: string;
  clearErrors?: UseFormClearErrors<T>;
  handleOnChange?: (newValues: string[]) => void;
}
