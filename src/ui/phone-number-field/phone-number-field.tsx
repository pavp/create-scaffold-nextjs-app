'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { Box, Divider, FormGroup, InputAdornment, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslations } from 'next-intl';

import { TextField } from '..';

import { CountryCodeMenuItem, FlagIcon, ForwardedInputMask } from './components';
import { DEFAULT_COUNTRY_CODE, PHONE_MASKS_BY_COUNTRY } from './constants';
import { getCountryByCode } from './helpers';
import { PhoneNumberFieldProps, PhoneNumberFieldRenderProps } from './types';

import styles from './styles.module.scss';

const { selectContainer, divider } = styles;

const PhoneNumberField = <T extends FieldValues>({
  value = '',
  label,
  selectedCountryOverride = DEFAULT_COUNTRY_CODE,
  countryOptions,
  fullWidth = false,
  control,
  required,
  name,
  errorMessage,
  width = '100%',
  placeholder,
  styles,
  onChange,
  clearValue,
  onChangeCountry,
}: PhoneNumberFieldProps<T>) => {
  const t = useTranslations('common');
  const [selectedCountry, setSelectedCountry] = useState<string>(selectedCountryOverride);
  const [phoneNumber, setPhoneNumber] = useState<string>(value);

  const mask = useMemo(() => PHONE_MASKS_BY_COUNTRY[selectedCountry.toUpperCase()], [selectedCountry]);

  const menuItems = useMemo(
    () =>
      Object.keys(countryOptions).flatMap((key) => {
        const countries = countryOptions[key];

        if (!countries) return [];

        return countries.map((country) => (
          <MenuItem key={country.code} disableRipple value={country.code}>
            <CountryCodeMenuItem {...country} />
          </MenuItem>
        ));
      }),
    [countryOptions],
  );

  const onCountryCodeChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newCountry = event.target.value;

      clearValue?.();
      setPhoneNumber('');
      setSelectedCountry(newCountry);
      onChangeCountry?.(newCountry);
    },
    [clearValue, onChangeCountry],
  );

  const onPhoneNumberChange = useCallback(
    (phoneNumber: string) => {
      setPhoneNumber(phoneNumber);
      onChange?.(phoneNumber);
    },
    [onChange],
  );

  const renderValue = useCallback(
    (value: string) => {
      const country = getCountryByCode(value, countryOptions);

      if (!country) return null;

      return <FlagIcon code={value} flagUrl={country.flagUrl} />;
    },
    [countryOptions],
  );

  const renderPhoneNumberField = useCallback(
    ({ value, onChange }: PhoneNumberFieldRenderProps) => (
      <TextField
        InputProps={{
          inputComponent: ForwardedInputMask as any,
          inputProps: { mask, value, onChangeInput: onChange },
        }}
        errorMessage={errorMessage}
        fullWidth={fullWidth}
        inputMode="tel"
        label={label}
        placeholder={placeholder}
        required={required}
        startAdornment={
          <InputAdornment position="start" sx={{ flexShrink: 0 }}>
            <Box className={selectContainer}>
              <Select
                autoWidth
                disableUnderline
                fullWidth
                MenuProps={{
                  role: 'listbox',
                  PaperProps: { sx: { maxHeight: '31.25rem' } },
                }}
                name="countryCode"
                renderValue={renderValue}
                sx={{
                  '& .MuiSelect-select:focus': {
                    backgroundColor: 'transparent',
                  },
                  '& .mui-1ucdrps-MuiSelect-select-MuiInputBase-input-MuiInput-input': {
                    paddingRight: '1.5rem !important',
                  },
                }}
                value={selectedCountry}
                variant="standard"
                onChange={onCountryCodeChange}
              >
                {menuItems}
              </Select>
              <Divider flexItem className={divider} orientation="vertical" variant="middle" />
            </Box>
          </InputAdornment>
        }
        styles={styles}
        width={width}
      />
    ),
    [
      fullWidth,
      required,
      label,
      width,
      styles,
      placeholder,
      errorMessage,
      mask,
      onCountryCodeChange,
      selectedCountry,
      renderValue,
      menuItems,
    ],
  );

  return (
    <FormGroup>
      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) =>
            renderPhoneNumberField({
              value: field.value,
              onChange: (value) => {
                onChange?.(value);
                field.onChange(value);
              },
            })
          }
          rules={{
            validate: (value) => {
              if (required && value === '') return t('textField.validate.required');

              return true;
            },
          }}
        />
      ) : (
        renderPhoneNumberField({ value: phoneNumber, onChange: (value) => onPhoneNumberChange(value) })
      )}
    </FormGroup>
  );
};

const MemoizedComponent = memo(PhoneNumberField) as typeof PhoneNumberField;

export { MemoizedComponent as PhoneNumberField };
