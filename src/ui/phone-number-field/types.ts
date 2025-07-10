import { Control, FieldValues, Path } from 'react-hook-form';
import { SxProps, Theme } from '@mui/material';

export interface Country {
  code: string;
  name: string;
  phoneCode: string;
  flagUrl: string;
}

export type CountryOptions = Partial<Record<string, Country[]>>;

export interface CommonPhoneNumberFieldProps {
  selectedCountryOverride?: string;
  countryOptions: CountryOptions;
  placeholder?: string;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  width?: number | string;
  errorMessage?: string;
  styles?: SxProps<Theme>;
  onChangeCountry?: (countryCode: string) => void;
}

interface ControlledPhoneNumberField<T extends FieldValues> extends CommonPhoneNumberFieldProps {
  control: Control<T, any>;
  name: Path<T>;
  value?: never;
  onChange?: (value: string) => void;
  clearValue: () => void;
}

interface UncontrolledPhoneNumberField extends CommonPhoneNumberFieldProps {
  control?: never;
  name?: never;
  value?: string;
  clearValue?: never;
  onChange?: (value: string) => void;
}

export type PhoneNumberFieldProps<T extends FieldValues> = ControlledPhoneNumberField<T> | UncontrolledPhoneNumberField;

export type PhoneNumberFieldRenderProps = {
  value: string;
  onChange: (value: string) => void;
};
