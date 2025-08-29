import { Control, FieldValues, Path } from 'react-hook-form';
import { RadioProps } from '@mui/material';

interface CommonRadioButtonProps extends Pick<RadioProps, 'disabled' | 'size' | 'color'> {
  labelPlacement?: 'bottom' | 'end' | 'start' | 'top';
  label?: string;
}

interface ControlledRadioButtonProps<T extends FieldValues> extends CommonRadioButtonProps {
  control: Control<T, any>;
  name: Path<T>;
  onChange?: never;
  value?: never;
}

interface UncontrolledRadioButtonProps extends CommonRadioButtonProps {
  control?: never;
  name?: never;
  value: boolean;
  onChange: (checked: boolean) => void;
}

export type RadioButtonProps<T extends FieldValues> = ControlledRadioButtonProps<T> | UncontrolledRadioButtonProps;

export type RadioButtonRenderProps = {
  value: boolean;
  onChange: (checked: boolean) => void;
};
