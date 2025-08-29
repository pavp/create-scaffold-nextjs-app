'use client';

import { ChangeEvent, memo, useCallback, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { FormControlLabel, FormGroup, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';

import { DEFAULT_NUMBER_PICKER_WIDTH } from './constants';
import { NumberPickerProps, NumberPickerRenderProps } from './number-picker.types';

const NumberPicker = <T extends FieldValues>({
  testId,
  placeholder,
  defaultValue,
  width = DEFAULT_NUMBER_PICKER_WIDTH,
  control,
  disabled,
  required,
  label,
  name,
  min,
  max,
  step,
  textFieldStyle,
  onChange,
  errorMessage,
}: NumberPickerProps<T>) => {
  const t = useTranslations('common');
  const [value, setValue] = useState<number | string | undefined>(defaultValue);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      const numericValue = newValue === '' ? '' : Number(newValue);

      if (numericValue === '') return;
      if ((min !== undefined && numericValue < min) || (max !== undefined && numericValue > max)) return;

      setValue(numericValue);
      onChange?.(numericValue);
    },
    [max, min, onChange],
  );

  const renderTextField = useCallback(
    ({ value, onChange }: NumberPickerRenderProps) => (
      <FormControlLabel
        control={
          <TextField
            className={textFieldStyle}
            data-testid={testId}
            disabled={disabled}
            error={!!errorMessage}
            helperText={errorMessage}
            placeholder={placeholder}
            required={required}
            slotProps={{
              input: {
                inputProps: { 'data-testid': `${testId}-input`, min, max, step },
              },
            }}
            sx={{ alignSelf: 'flex-start', width }}
            type="number"
            value={value}
            onChange={onChange}
          />
        }
        label={label}
        labelPlacement="top"
        slotProps={{ typography: { alignSelf: 'flex-start' } }}
      />
    ),
    [label, testId, placeholder, textFieldStyle, min, max, step, errorMessage, disabled, required, width],
  );

  return (
    <FormGroup>
      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => renderTextField(field)}
          rules={{
            validate: (value) => {
              if (required && value === '') return t('numberPicker.validate.required');
              if (isNaN(Number(value))) return t('numberPicker.validate.valid');
              if (min !== undefined && Number(value) < min) return t('numberPicker.validate.min', { min });
              if (max !== undefined && Number(value) > max) return t('numberPicker.validate.max', { max });

              return true;
            },
          }}
        />
      ) : (
        renderTextField({ value, onChange: handleChange })
      )}
    </FormGroup>
  );
};

const MemoizedComponent = memo(NumberPicker) as typeof NumberPicker;

export { MemoizedComponent as NumberPicker };
