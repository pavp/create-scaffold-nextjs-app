import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, renderHook, RenderOptions } from '@testing-library/react';

import { LocalizationProvider } from '@/core/components';
import { AppStore, makeStore, RootState } from '@/store';
import theme from '@/theme';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

const Wrapper = ({ children, store }: PropsWithChildren<{ store: AppStore }>): React.ReactElement => (
  <Provider store={store}>
    <LocalizationProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LocalizationProvider>
  </Provider>
);

const renderHookWithProviders = <Result, Props>(
  render: (initialProps: Props) => Result,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = makeStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) => {
  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...renderHook(render, { wrapper: (props) => <Wrapper store={store} {...props} />, ...renderOptions }),
  };
};

const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = makeStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) => {
  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: (props) => <Wrapper store={store} {...props} />, ...renderOptions }) };
};

export * from '@testing-library/react';

export { renderHookWithProviders, renderWithProviders };

export * from './build-rtk-query-action';
