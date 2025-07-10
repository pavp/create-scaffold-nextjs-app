import { CountryOptions } from '../../types';

export const getCodeByCountryName = (name: string, countryOptions: CountryOptions) => {
  for (const key in countryOptions) {
    const countries = countryOptions[key];
    const country = countries?.find((country) => country.code === name);

    if (country) return country.phoneCode;
  }

  return null;
};
