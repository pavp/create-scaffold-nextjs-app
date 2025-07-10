import { ComponentProps } from 'react';
import { faker } from '@faker-js/faker';
import { render, screen } from '@test/utils/test-utils';
import { IntlProvider } from 'next-intl';

import { config } from '@/config';

import { CustomNextIntlClientProvider } from './custom-next-intl-client-provider';

type NextIntlClientProviderProps = Omit<ComponentProps<typeof IntlProvider>, 'locale'> & {
  locale?: string;
};

jest.mock('next-intl', () => {
  return {
    NextIntlClientProvider: ({ children, locale, timeZone, messages }: NextIntlClientProviderProps) => (
      <div>
        {children}
        <div>{locale}</div>
        <div>{timeZone}</div>
        <div>{JSON.stringify(messages)}</div>
      </div>
    ),
  };
});

describe('CustomNextIntlClientProvider', () => {
  const children = faker.lorem.word();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render NextIntlClientProvider with default locale and timezone', () => {
    const locale = config.translation.defaultLocale;

    const { container } = render(
      <CustomNextIntlClientProvider>
        <div>{children}</div>
      </CustomNextIntlClientProvider>,
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText(children)).toBeInTheDocument();
    expect(screen.getByText(locale)).toBeInTheDocument();
    expect(screen.getByText(timeZone)).toBeInTheDocument();
  });

  it('should render NextIntlClientProvider with provided locale and messages', () => {
    const locale = 'es';
    const messages = { hello: faker.lorem.word(), world: faker.lorem.word() };
    const expectedMessages = JSON.stringify(messages);

    const { container } = render(
      <CustomNextIntlClientProvider locale={locale} messages={messages}>
        <div>{children}</div>
      </CustomNextIntlClientProvider>,
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText(children)).toBeInTheDocument();
    expect(screen.getByText(locale)).toBeInTheDocument();
    expect(screen.getByText(timeZone)).toBeInTheDocument();
    expect(screen.getByText(expectedMessages)).toBeInTheDocument();
  });
});
