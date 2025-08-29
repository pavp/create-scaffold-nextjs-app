import { Control, FieldValues, Path } from 'react-hook-form';
import { SxProps, Theme } from '@mui/material';

export interface CommonTextAreaProps {
  testId?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  width?: number | string;
  className?: string;
  rows?: number;
  maxLength?: number;
  styles?: SxProps<Theme>;
}

interface ControlledTextArea<T extends FieldValues> extends CommonTextAreaProps {
  control: Control<T, any>;
  name: Path<T>;
  errorMessage?: string;
  onChange?: never;
  defaultValue?: never;
}

interface UncontrolledTextArea extends CommonTextAreaProps {
  onChange?: (value: string) => void;
  defaultValue?: number | string;
  control?: never;
  name?: never;
  errorMessage?: never;
}

export type TextAreaProps<T extends FieldValues> = (ControlledTextArea<T> | UncontrolledTextArea) & {
  maxLength?: number;
};
