import { CountryOptions } from '../../types';

export const getCountryByCode = (code: string, countryOptions: CountryOptions) => {
  for (const key in countryOptions) {
    const countries = countryOptions[key];
    const country = countries?.find((country) => country.code === code);

    if (country) return country;
  }

  return null;
};
