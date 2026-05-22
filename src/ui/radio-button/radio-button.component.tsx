'use client';

import { useCallback } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { FormControl, FormControlLabel, Radio } from '@mui/material';

import { RadioButtonProps, RadioButtonRenderProps } from './radio-button.types';

export const RadioButton = <T extends FieldValues>({
  onChange,
  size = 'small',
  color = 'primary',
  labelPlacement = 'bottom',
  label = '',
  control,
  name,
  value = false,
  ...rest
}: RadioButtonProps<T>) => {
  const handleChange = useCallback(
    (checked: boolean) => {
      onChange?.(checked);
    },
    [onChange],
  );

  const renderRadioButton = ({ value, onChange }: RadioButtonRenderProps) => (
    <FormControlLabel
      {...rest}
      checked={value}
      color={color}
      control={<Radio size={size} />}
      label={label}
      labelPlacement={labelPlacement}
      sx={{
        '& .MuiFormControlLabel-label': { fontSize: '0.7rem', alignItems: 'center', margin: 0, marginTop: -0.5 },
        marginTop: -1,
      }}
      value={value}
      onClick={() => onChange(!value)}
    />
  );

  return (
    <FormControl>
      {control ? (
        <Controller control={control} name={name} render={({ field }) => renderRadioButton(field)} />
      ) : (
        renderRadioButton({ value, onChange: handleChange })
      )}
    </FormControl>
  );
};
