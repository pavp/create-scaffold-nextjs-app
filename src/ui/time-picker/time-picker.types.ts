import { Control, FieldValues, Path } from 'react-hook-form';
import { TimeView } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';

interface CommonTimePickerProps {
  format?: string;
  label?: string;
  width?: number | string;
  views?: TimeView[];
}

interface TimePickerWithControlProps<T extends FieldValues> extends CommonTimePickerProps {
  onChange?: never;
  label?: string;
  control: Control<T, any>;
  name: Path<T>;
  errorMessage?: string;
}

interface TimePickerWithoutControlProps extends CommonTimePickerProps {
  control?: never;
  name?: never;
  errorMessage?: never;
  onChange: (value: Dayjs | null) => void;
}

export type TimePickerProps<T extends FieldValues> = TimePickerWithControlProps<T> | TimePickerWithoutControlProps;

export type TimePickerRenderProps = {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
};
