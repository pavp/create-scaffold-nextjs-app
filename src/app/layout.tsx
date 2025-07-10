import { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { useLocale, useMessages, useTranslations } from 'next-intl';

import {
  CustomNextIntlClientProvider,
  LocalizationProvider,
  MuiXLicense,
  SettingsWrapper,
  StoreProvider,
  Tracking,
} from '@/core/components';
import theme from '@/theme';
import { CssBaseline, Dialog, ThemeProvider, Toast } from '@/ui';

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default function RootLayout(props: RootLayoutProps) {
  const t = useTranslations('common');
  const messages = useMessages();
  const locale = useLocale();

  return (
    <html data-testid="html-block" lang={locale}>
      <head>
        <title data-testid="window-title">{t('windowTitle')}</title>
        <link data-testid="favicon" href="/favicon.png" rel="icon" type="image/x-icon" />
      </head>
      <body>
        <StoreProvider>
          <MuiXLicense />
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <CustomNextIntlClientProvider locale={locale} messages={messages}>
              <SettingsWrapper>
                <ThemeProvider theme={theme}>
                  <LocalizationProvider>
                    <Tracking>
                      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                      <CssBaseline />
                      <Toast />
                      <Dialog />
                      {props.children}
                    </Tracking>
                  </LocalizationProvider>
                </ThemeProvider>
              </SettingsWrapper>
            </CustomNextIntlClientProvider>
          </AppRouterCacheProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
