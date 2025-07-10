'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import { FormControl, FormControlLabel, FormHelperText, SelectChangeEvent } from '@mui/material';
import { useTranslations } from 'next-intl';

import { SelectorCommon } from './components';
import { selectValue } from './helpers';
import { ISelector } from './types';

import styles from './styles.module.scss';

const DEFAULT_SELECTOR_WIDTH = '200px';

const { mainContainer } = styles;

export const Selector = <T extends FieldValues>({
  classNameMainContainer,
  defaultValues = [],
  dontAllowEmptyValues = false,
  list,
  name,
  required,
  fullWidth = false,
  width = DEFAULT_SELECTOR_WIDTH,
  error = false,
  messageError,
  control,
  multiple = false,
  needsTranslation = false,
  placeholder,
  disabled = false,
  label = '',
  clearErrors,
  handleOnChange,
}: ISelector<T>) => {
  const t = useTranslations('common');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultValues);

  useEffect(() => {
    if (!selectedOptions.length && defaultValues.length) setSelectedOptions(defaultValues);
  }, [defaultValues, selectedOptions.length]);

  const handleChange = useCallback(
    (event: SelectChangeEvent<string[]>, onChange?: (...event: any[]) => void) => {
      const { value } = event.target;
      let selectedValue: string[] = selectValue({
        value,
        selectedOptions,
        list,
        dontAllowEmptyValues,
      });

      if (selectedValue.includes('all')) {
        const allValues = list.map((option) => option.value);

        selectedValue = selectedOptions.length === list.length ? [] : allValues;
      }

      setSelectedOptions(selectedValue);
      handleOnChange?.(selectedValue);
      clearErrors?.(name);
      onChange?.(selectedValue);
    },
    [clearErrors, dontAllowEmptyValues, handleOnChange, list, name, selectedOptions],
  );

  return (
    <FormControl
      className={classNameMainContainer ?? mainContainer}
      error={error}
      sx={{ width: fullWidth ? '100%' : width }}
    >
      {control ? (
        <Controller
          control={control}
          defaultValue={defaultValues as PathValue<T, Path<T>>}
          name={name}
          render={({ field }) => (
            <FormControlLabel
              control={
                <SelectorCommon
                  disabled={disabled}
                  fullWidth={fullWidth}
                  handleChange={(event) => handleChange(event, field.onChange)}
                  list={list}
                  multiple={multiple}
                  name={name}
                  needsTranslation={needsTranslation}
                  placeholder={placeholder}
                  required={required}
                  selectedOptions={field.value}
                  width={width}
                />
              }
              label={label}
              labelPlacement="top"
              slotProps={{ typography: { alignSelf: 'flex-start' } }}
            />
          )}
          rules={{ required: required ? t('selector.validate.required') : false }}
        />
      ) : (
        <FormControlLabel
          control={
            <SelectorCommon
              disabled={disabled}
              fullWidth={fullWidth}
              handleChange={handleChange}
              list={list}
              multiple={multiple}
              name={name}
              needsTranslation={needsTranslation}
              placeholder={placeholder}
              required={required}
              selectedOptions={selectedOptions}
              width={width}
            />
          }
          label={label}
          labelPlacement="top"
          slotProps={{ typography: { alignSelf: 'flex-start' } }}
        />
      )}
      {error && messageError && <FormHelperText data-testid="message-error">{messageError}</FormHelperText>}
    </FormControl>
  );
};
