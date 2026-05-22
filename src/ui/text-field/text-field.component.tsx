'use client';

import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { FormControlLabel, FormGroup, TextField as MuiTextField } from '@mui/material';
import { useTranslations } from 'next-intl';

import { DEFAULT_TEXT_FIELD_WIDTH } from './constants';
import { TextFieldProps, TextFieldRenderProps } from './text-field.types';

const TextField = <T extends FieldValues>({
  testId,
  placeholder,
  defaultValue = '',
  fullWidth = false,
  width = DEFAULT_TEXT_FIELD_WIDTH,
  control,
  disabled,
  required,
  readonly,
  label,
  name,
  className,
  onChange,
  errorMessage,
  type = 'text',
  multiline = false,
  rows,
  minRows,
  maxRows,
  maxLength,
  startAdornment,
  endAdornment,
  styles,
  InputProps,
  inputMode = 'text',
  rules,
}: TextFieldProps<T>) => {
  const [value, setValue] = useState<number | string>(defaultValue);
  const t = useTranslations('common');

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange],
  );

  const renderTextField = useCallback(
    ({ value, onChange, onBlur }: TextFieldRenderProps) => (
      <FormControlLabel
        control={
          <MuiTextField
            className={className}
            data-testid={testId}
            disabled={disabled}
            error={!!errorMessage}
            helperText={errorMessage}
            maxRows={rows ? undefined : maxRows}
            minRows={rows ? undefined : minRows}
            multiline={multiline}
            placeholder={placeholder}
            required={required}
            rows={rows}
            slotProps={{
              input: {
                inputProps: { 'data-testid': `${testId}-input`, maxLength, inputMode },
                startAdornment,
                endAdornment,
                readOnly: readonly,
                ...InputProps,
              },
            }}
            sx={{ alignSelf: 'flex-start', width: fullWidth ? '100%' : width, ...styles }}
            type={type}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
          />
        }
        label={label}
        labelPlacement="top"
        slotProps={{ typography: { alignSelf: 'flex-start' } }}
      />
    ),
    [
      InputProps,
      className,
      disabled,
      endAdornment,
      errorMessage,
      fullWidth,
      inputMode,
      label,
      maxLength,
      maxRows,
      minRows,
      multiline,
      placeholder,
      readonly,
      required,
      rows,
      startAdornment,
      styles,
      testId,
      type,
      width,
    ],
  );

  return (
    <FormGroup>
      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => renderTextField(field)}
          rules={{
            ...rules,
            validate: {
              required: (value) => {
                if (required && (value === '' || value === undefined || value === null))
                  return t('textField.validate.required');

                return true;
              },
              ...(typeof rules?.validate === 'object' ? rules.validate : {}),
              ...(typeof rules?.validate === 'function' ? { custom: rules.validate } : {}),
            },
          }}
        />
      ) : (
        renderTextField({ value, onChange: handleChange })
      )}
    </FormGroup>
  );
};

const MemoizedComponent = memo(TextField) as typeof TextField;

export { MemoizedComponent as TextField };
