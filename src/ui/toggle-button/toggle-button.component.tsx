'use client';

import { memo, useCallback } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { FormControl, FormControlLabel, ToggleButton as MuiToggleButton } from '@mui/material';

import colors from '@/styles/colors';

import { ToggleButtonProps, ToggleButtonRenderProps } from './toggle-button.types';

const ToggleButton = <T extends FieldValues>({
  onChange,
  color = 'primary',
  labelPlacement = 'top',
  label = '',
  control,
  name,
  value = false,
  children,
  height = 44,
  width = 58,
  selectedBackgroundColor = colors.primary,
  unselectedBackgroundColor = colors.whiteMain,
  ...rest
}: ToggleButtonProps<T>) => {
  const handleChange = useCallback(
    (checked: boolean) => {
      onChange?.(checked);
    },
    [onChange],
  );

  const renderToggleButton = useCallback(
    ({ value, onChange }: ToggleButtonRenderProps) => (
      <FormControlLabel
        {...rest}
        checked={value}
        color={color}
        control={
          <MuiToggleButton
            sx={{
              height,
              width,
              backgroundColor: value ? selectedBackgroundColor : unselectedBackgroundColor,
              borderRadius: 50,
              '&.Mui-selected': {
                backgroundColor: selectedBackgroundColor,
                '&:hover': {
                  backgroundColor: value ? selectedBackgroundColor : unselectedBackgroundColor,
                },
              },
              '&:hover': {
                backgroundColor: value ? selectedBackgroundColor : unselectedBackgroundColor,
              },
              boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.08)',
              border: 'none',
            }}
            value="check"
          >
            {children?.(value)}
          </MuiToggleButton>
        }
        label={label}
        labelPlacement={labelPlacement}
        value={value}
        onClick={() => onChange(!value)}
      />
    ),
    [children, color, height, label, labelPlacement, rest, selectedBackgroundColor, unselectedBackgroundColor, width],
  );

  return (
    <FormControl>
      {control ? (
        <Controller control={control} name={name} render={({ field }) => renderToggleButton(field)} />
      ) : (
        renderToggleButton({ value, onChange: handleChange })
      )}
    </FormControl>
  );
};

const MemoizedComponent = memo(ToggleButton);

export { MemoizedComponent as ToggleButton };
