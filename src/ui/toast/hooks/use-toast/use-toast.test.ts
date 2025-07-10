import react from 'react';
import { act, renderHookWithProviders } from '@test/utils/test-utils';

import * as reduxHooks from '@/store/hooks';

import { mockToastData } from '../../__mocks__';
import { TOAST_SUCCESS_DURATION } from '../../constants';

import { useToast } from './use-toast';

jest.mock('@/ui/toast/store/slice', () => {
  const realModule = jest.requireActual('@/ui/toast/store/slice');

  return {
    ...realModule,
    closeToast: jest.fn(),
  };
});

jest.mock('@/core/helpers', () => {
  const realModule = jest.requireActual('@/core/helpers');

  return {
    ...realModule,
    delayCallback: jest.fn(),
  };
});

const setup = (toast = mockToastData) => {
  jest.useFakeTimers();
  jest.spyOn(reduxHooks, 'useAppSelector').mockReturnValue(toast);
  jest.spyOn(react, 'useRef').mockReturnValue({ current: true });

  const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

  const spyOnCloseToast = jest.spyOn(require('@/ui/toast/store/slice'), 'closeToast');

  spyOnCloseToast.mockImplementation(() => jest.fn());

  const spyOnDelayCallback = jest.spyOn(require('@/core/helpers'), 'delayCallback');

  spyOnDelayCallback.mockImplementation(() => jest.fn());

  const context = renderHookWithProviders(useToast);

  return { context, spyOnCloseToast, spyOnDelayCallback, clearTimeoutSpy };
};

describe('useToast hook', () => {
  it('should check return values from hook by default', () => {
    const { context } = setup();

    const { snackbarOpen, severity, message, onConfirmation, handleClose } = context.result.current;

    expect(snackbarOpen).toBe(mockToastData.snackbarOpen);
    expect(severity).toBe(mockToastData.severity);
    expect(message).toBe(mockToastData.snackbarMessage);
    expect(onConfirmation).toBeDefined();
    expect(handleClose).toBeDefined();
  });

  it('should translate message if required', () => {
    const { context } = setup({ ...mockToastData, needTranslation: true });

    const { message } = context.result.current;

    const spyOnUseTranslations = jest.spyOn(require('next-intl'), 'useTranslations');

    spyOnUseTranslations.mockImplementation(() => jest.fn());

    expect(message).toBe(mockToastData.snackbarMessage);
    expect(spyOnUseTranslations).toHaveBeenCalled();
  });

  it('should call closeToast and delayCallback on handleClose', () => {
    const { context, spyOnCloseToast, spyOnDelayCallback } = setup();

    const { handleClose } = context.result.current;

    act(() => {
      handleClose();
    });

    expect(spyOnCloseToast).toHaveBeenCalled();
    expect(spyOnDelayCallback).toHaveBeenCalled();
  });

  it('should call clearTimeout if severity success and handleClose when timeout ends', () => {
    const { spyOnCloseToast, clearTimeoutSpy } = setup({
      ...mockToastData,
      snackbarOpen: true,
      severity: 'SUCCESS',
    });

    expect(spyOnCloseToast).not.toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    jest.advanceTimersByTime(TOAST_SUCCESS_DURATION);

    expect(spyOnCloseToast).toHaveBeenCalled();
  });
});
