// Shared next-intl mock for better performance
const React = require('react');

module.exports = {
  useTranslations: () => (key) => key,
  useLocale: () => 'en',
  useMessages: () => ({}),
  useFormatter: () => ({
    dateTime: (date) => date.toISOString(),
    number: (num) => num.toString(),
  }),
  NextIntlClientProvider: ({ children }) => React.createElement('div', null, children),
};
