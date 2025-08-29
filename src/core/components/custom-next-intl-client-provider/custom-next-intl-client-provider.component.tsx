'use client';

import { memo, PropsWithChildren } from 'react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';

import { config } from '@/config';

interface ICustomNextIntlClientProvider extends PropsWithChildren {
  locale?: string;
  messages?: AbstractIntlMessages;
}

// Component that provides the locale and messages to the NextIntlClientProvider from client side
const CustomNextIntlClientProvider = ({
  children,
  locale = config.translation.defaultLocale,
  messages,
}: ICustomNextIntlClientProvider) => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const now = new Date();

  return (
    <NextIntlClientProvider locale={locale} messages={messages} now={now} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
};

const MemoizedComponent = memo(CustomNextIntlClientProvider);

export { MemoizedComponent as CustomNextIntlClientProvider };
