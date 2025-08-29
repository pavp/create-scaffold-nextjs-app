import { JSX } from 'react';

export interface FilePickerProps {
  accept?: string;
  sizeLimit?: number;
  defaultValue?: string;
  onChange: (file: File) => void;
  testId?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  width?: number | string;
  className?: string;
  startAdornment?: JSX.Element;
}
