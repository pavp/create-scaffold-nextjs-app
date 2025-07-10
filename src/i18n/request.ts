import { getRequestConfig } from 'next-intl/server';

import { Endpoint } from '@/api/endpoint';
import { config } from '@/config';

import { routing } from './routing';

const { locales, revalidate } = config.translation;

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment in the URL
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) locale = routing.defaultLocale;

  return {
    locale,
    messages: {
      common: await fetch(`${config.apiUrl}${Endpoint.Translation}/${locale}/common`, { next: { revalidate } })
        .then((res) => res.json())
        .catch(() => ({})),
    },
  };
});
