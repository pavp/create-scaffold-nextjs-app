import { Control, FieldValues, Path } from 'react-hook-form';
import { ToggleButtonProps as MuiToggleButtonProps } from '@mui/material';

interface CommonToggleButtonProps extends Pick<MuiToggleButtonProps, 'disabled' | 'color'> {
  labelPlacement?: 'bottom' | 'end' | 'start' | 'top';
  label?: string;
  height?: number | string;
  width?: number | string;
  selectedBackgroundColor?: string;
  unselectedBackgroundColor?: string;
  children?: (value: boolean) => React.ReactNode;
}

interface ControlledToggleButtonProps<T extends FieldValues> extends CommonToggleButtonProps {
  control: Control<T, any>;
  name: Path<T>;
  onChange?: never;
  value?: never;
}

interface UncontrolledToggleButtonProps extends CommonToggleButtonProps {
  control?: never;
  name?: never;
  value: boolean;
  onChange: (checked: boolean) => void;
}

export type ToggleButtonProps<T extends FieldValues> = ControlledToggleButtonProps<T> | UncontrolledToggleButtonProps;

export type ToggleButtonRenderProps = {
  value: boolean;
  onChange: (checked: boolean) => void;
};
