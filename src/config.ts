const env = process.env.NODE_ENV || 'development';
const revalidateTranslationsProd = 1800; //30min
const revalidateTranslationsDev = 0;

export const config = {
  env,
  isDev: env === 'development',
  isTst: env === 'test',
  isPrd: env === 'production',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  appName: 'create-scaffold-app' as const,
  muiLicense: process.env.NEXT_PUBLIC_MUI_PRO || '',
  translation: {
    revalidate: env === 'development' ? revalidateTranslationsDev : revalidateTranslationsProd,
    // after adding a new locale, you need to add the locale in LocalizationProvider
    locales: ['en', 'es', 'fr', 'pt', 'de', 'nl', 'sv'] as const,
    defaultLocale: 'en' as const,
  },
};
