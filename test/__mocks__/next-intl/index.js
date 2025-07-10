const NextIntl = {
  useTranslations: jest.fn(() => jest.fn((key) => key)),
  useLocale: jest.fn(),
  useFormatter: jest.fn(),
};

module.exports = NextIntl;
