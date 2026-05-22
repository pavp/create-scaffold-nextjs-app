import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';

import { LocalizationProvider } from '@/core/components';
import theme from '@/theme';

import type { AllProvidersProps } from '../test-utils.types';

/**
 * Wrapper component that provides all necessary providers for testing
 */
export const AllProviders = ({ children, queryClient }: AllProvidersProps): React.ReactElement => (
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LocalizationProvider>
  </QueryClientProvider>
);
