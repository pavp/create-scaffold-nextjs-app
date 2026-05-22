import { ChangeEvent } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

interface CommonSwitchProps {
  testId?: string;
  label?: string;
  labelLeft?: string;
  height?: number | string;
  disabled?: boolean;
}

interface ControlledSwitchProps<T extends FieldValues> extends CommonSwitchProps {
  control: Control<T, any>;
  name: Path<T>;
  onChange?: never;
  defaultChecked?: never;
}

interface UncontrolledSwitchProps extends CommonSwitchProps {
  control?: never;
  name?: never;
  onChange: (checked: boolean) => void;
  defaultChecked?: boolean;
}

export type SwitchProps<T extends FieldValues> = ControlledSwitchProps<T> | UncontrolledSwitchProps;

export type SwitchRenderProps = {
  value: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
