'use client';

import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { FormGroup, Switch as SwitchMui } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { SwitchProps, SwitchRenderProps } from './types';

const Switch = <T extends FieldValues>({
  testId = '',
  defaultChecked = false,
  label = '',
  control,
  height,
  disabled = false,
  name,
  labelLeft = '',
  onChange,
}: SwitchProps<T>) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.checked);
      setChecked(event.target.checked);
    },
    [onChange],
  );

  const renderSwitch = useCallback(
    ({ value, onChange }: SwitchRenderProps) => (
      <Grid container alignItems="center" component="label" spacing={1} wrap="nowrap">
        {!!labelLeft && <Grid>{labelLeft}</Grid>}
        <Grid>
          <SwitchMui
            checked={value}
            data-testid={testId}
            disabled={disabled}
            slotProps={{ input: { 'aria-label': 'title' } }}
            onChange={onChange}
          />
        </Grid>
        {!!label && <Grid sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</Grid>}
      </Grid>
    ),
    [disabled, label, labelLeft, testId],
  );

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  return (
    <FormGroup sx={{ height }}>
      {control ? (
        <Controller control={control} name={name} render={({ field }) => renderSwitch(field)} />
      ) : (
        renderSwitch({ value: checked, onChange: handleChange })
      )}
    </FormGroup>
  );
};

const MemoizedComponent = memo(Switch) as typeof Switch;

export { MemoizedComponent as Switch };
