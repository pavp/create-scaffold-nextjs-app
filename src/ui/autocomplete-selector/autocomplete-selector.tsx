'use client';

import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { Autocomplete, FormControlLabel, FormGroup, InputAdornment, TextField as MuiTextField } from '@mui/material';
import { useTranslations } from 'next-intl';

import { AutocompleteSelectorProps, AutocompleteSelectorRenderProps, IAutocompleteOption } from './types';

const AutocompleteSelector = <T extends FieldValues>({
  testId,
  placeholder,
  defaultValue = null,
  control,
  disabled,
  required,
  label,
  name,
  className,
  errorMessage,
  hideLabel = false,
  backgroundColor = 'transparent',
  options,
  width = '100%',
  startAdornment,
  onChange,
  onChangeInput,
}: AutocompleteSelectorProps<T>) => {
  const t = useTranslations('common');
  const [value, setValue] = useState<IAutocompleteOption | null>(defaultValue);

  const handleChange = useCallback(
    (_: ChangeEvent<{}>, newValue: IAutocompleteOption | null) => {
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    (_: ChangeEvent<{}>, newInputValue: string, reason: string) => {
      if (reason === 'reset') return; // input change caused by option selection

      onChangeInput?.(newInputValue);
    },
    [onChangeInput],
  );

  const renderAutocomplete = useCallback(
    ({ value, onChange }: AutocompleteSelectorRenderProps) => (
      <FormControlLabel
        control={
          <Autocomplete
            data-testid={testId}
            filterOptions={(options) => options}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) => option.label}
            noOptionsText={t('textField.noOptionsText')}
            options={options}
            renderInput={(params) => (
              <MuiTextField
                {...params}
                className={className}
                disabled={disabled}
                error={!!errorMessage}
                helperText={errorMessage}
                placeholder={placeholder}
                required={required}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    inputProps: { ...params.inputProps, 'data-testid': `${testId}-input` },
                    startAdornment: startAdornment ? (
                      <InputAdornment position="start">{startAdornment}</InputAdornment>
                    ) : null,
                  },
                }}
                sx={{ alignSelf: 'flex-start', width: '100%', marginLeft: 0, backgroundColor, borderRadius: 1 }}
              />
            )}
            sx={{ width }}
            value={value}
            onChange={onChange}
            onInputChange={handleInputChange}
          />
        }
        label={label}
        labelPlacement={hideLabel ? undefined : 'top'}
        slotProps={{ typography: { alignSelf: 'flex-start' } }}
        sx={{ alignItems: 'flex-start', width: '100%' }}
      />
    ),
    [
      label,
      hideLabel,
      testId,
      options,
      handleInputChange,
      width,
      t,
      placeholder,
      className,
      startAdornment,
      errorMessage,
      disabled,
      required,
      backgroundColor,
    ],
  );

  useEffect(() => setValue(defaultValue), [defaultValue]);

  return (
    <FormGroup sx={{ width: '100%' }}>
      {control ? (
        <Controller control={control} name={name} render={({ field }) => renderAutocomplete(field)} />
      ) : (
        renderAutocomplete({ value, onChange: handleChange })
      )}
    </FormGroup>
  );
};

const MemoizedComponent = memo(AutocompleteSelector) as typeof AutocompleteSelector;

export { MemoizedComponent as AutocompleteSelector };
