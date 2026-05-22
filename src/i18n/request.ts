import { getRequestConfig } from 'next-intl/server';

import { endpoints } from '@/api/endpoints';
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
      common: await fetch(`${config.apiUrl}${endpoints.SETTINGS.TRANSLATION}/${locale}/common`, {
        next: { revalidate },
      } as RequestInit)
        .then((res) => res.json())
        .catch(() => ({})),
    },
  };
});
