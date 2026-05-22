import { ChangeEvent } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

interface CommonNumberPickerProps {
  testId?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: string;
  width?: number | string;
  textFieldStyle?: string;
}

interface ControlledNumberPicker<T extends FieldValues> extends CommonNumberPickerProps {
  control: Control<T, any>;
  name: Path<T>;
  errorMessage?: string;
  onChange?: never;
  defaultValue?: never;
}

interface UncontrolledNumberPicker extends CommonNumberPickerProps {
  onChange: (value: number | string) => void;
  defaultValue?: number | string;
  control?: never;
  name?: never;
  errorMessage?: never;
}

export type NumberPickerProps<T extends FieldValues> = ControlledNumberPicker<T> | UncontrolledNumberPicker;

export type NumberPickerRenderProps = {
  value?: number | string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
