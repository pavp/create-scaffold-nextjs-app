import { ChangeEvent, FocusEvent, JSX } from 'react';
import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { FilledInputProps, InputProps, OutlinedInputProps, SxProps, Theme } from '@mui/material';

export interface CommonTextFieldProps {
  testId?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  fullWidth?: boolean;
  width?: number | string;
  className?: string;
  type?: 'text' | 'number';
  inputMode?: InputProps['inputMode'];
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
  styles?: SxProps<Theme>;
  InputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps> | undefined;
  errorMessage?: string;
}

interface ControlledTextField<T extends FieldValues> extends CommonTextFieldProps {
  control: Control<T, any>;
  name: Path<T>;
  onChange?: never;
  defaultValue?: never;
  rules?: Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'> | undefined;
}

interface UncontrolledTextField extends CommonTextFieldProps {
  onChange?: (value: string) => void;
  defaultValue?: number | string;
  control?: never;
  name?: never;
  rules?: never;
}

export type TextFieldProps<T extends FieldValues> = (ControlledTextField<T> | UncontrolledTextField) & {
  maxLength?: number;
};

export type TextFieldRenderProps = {
  value: number | string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
};
