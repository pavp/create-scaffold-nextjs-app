'use client';

import { memo, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { FormControlLabel, FormGroup } from '@mui/material';
import { TimePicker as TimePickerMui } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import {
  DEFAULT_TIME_PICKER_FORMAT,
  DEFAULT_TIME_PICKER_VIEWS,
  DEFAULT_TIME_PICKER_WIDTH,
  DEFAULT_TIME_STEPS,
} from './constants';
import { TimePickerProps, TimePickerRenderProps } from './time-picker.types';

const TimePicker = <T extends FieldValues>({
  format = DEFAULT_TIME_PICKER_FORMAT,
  views = DEFAULT_TIME_PICKER_VIEWS,
  width = DEFAULT_TIME_PICKER_WIDTH,
  label = '',
  control,
  name,
  errorMessage,
  onChange,
}: TimePickerProps<T>) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('common');

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const renderTimePicker = ({ value, onChange }: TimePickerRenderProps) => (
    <FormControlLabel
      control={
        <TimePickerMui
          ampm={false}
          format={format}
          open={open}
          slotProps={{
            inputAdornment: { position: 'start', onClick: handleOpen },
            textField: { error: !!errorMessage, helperText: errorMessage, onClick: handleOpen },
          }}
          sx={{ alignSelf: 'flex-start', width }}
          timeSteps={DEFAULT_TIME_STEPS}
          value={value ?? null}
          views={views}
          onChange={onChange}
          onClose={handleClose}
        />
      }
      label={label}
      labelPlacement="top"
      slotProps={{ typography: { alignSelf: 'flex-start' } }}
    />
  );

  return (
    <FormGroup>
      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => renderTimePicker(field)}
          rules={{
            required: t('timePicker.validate.required'),
            validate: {
              isValidTime: (value) => dayjs(value).isValid() || t('timePicker.validate.valid'),
            },
          }}
        />
      ) : (
        renderTimePicker({ value: null, onChange })
      )}
    </FormGroup>
  );
};

const MemoizedComponent = memo(TimePicker) as typeof TimePicker;

export { MemoizedComponent as TimePicker };
