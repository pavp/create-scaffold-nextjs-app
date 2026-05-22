import { ChangeEvent } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

export interface IAutocompleteOption {
  id: string;
  label: string;
}

interface CommonAutocompleteProps {
  testId?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  width?: number | string;
  className?: string;
  hideLabel?: boolean;
  backgroundColor?: string;
  options: IAutocompleteOption[];
  startAdornment?: React.ReactNode;
}

interface ControlledAutocomplete<T extends FieldValues> extends CommonAutocompleteProps {
  control: Control<T, any>;
  name: Path<T>;
  errorMessage?: string;
  onChange?: never;
  defaultValue?: never;
  onChangeInput?: never;
}

interface UncontrolledAutocomplete extends CommonAutocompleteProps {
  defaultValue?: IAutocompleteOption | null;
  control?: never;
  name?: never;
  errorMessage?: never;
  onChange: (value: IAutocompleteOption | null) => void;
  onChangeInput?: (inputValue: string) => void;
}

export type AutocompleteSelectorProps<T extends FieldValues> = ControlledAutocomplete<T> | UncontrolledAutocomplete;

export type AutocompleteSelectorRenderProps = {
  value: IAutocompleteOption | null;
  onChange: (event: ChangeEvent<{}>, newValue: IAutocompleteOption | null) => void;
};
