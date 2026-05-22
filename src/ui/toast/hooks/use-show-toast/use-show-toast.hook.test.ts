import { renderHook } from '@testing-library/react';

import { useToastVisibilitySelector } from '../../stores/selectors';
import { useToastActions } from '../../stores/toast.store.actions';

import { useShowToast } from './use-show-toast.hook';

jest.mock('../../stores/selectors', () => ({
  useToastVisibilitySelector: jest.fn(),
}));

jest.mock('../../stores/toast.store.actions', () => ({
  useToastActions: jest.fn(),
}));

describe('useShowToast', () => {
  const mockShowToast = jest.fn();
  const mockCloseToast = jest.fn();

  beforeEach(() => {
    (useToastVisibilitySelector as jest.Mock).mockReturnValue({ snackbarOpen: false });
    (useToastActions as jest.Mock).mockReturnValue({ showToast: mockShowToast, closeToast: mockCloseToast });
  });

  it('should expose isToastVisible and actions', () => {
    const { result } = renderHook(() => useShowToast());

    expect(result.current.isToastVisible).toBe(false);
    expect(typeof result.current.showToast).toBe('function');
    expect(typeof result.current.closeToast).toBe('function');
  });

  it('should reflect visibility selector value', () => {
    (useToastVisibilitySelector as jest.Mock).mockReturnValue({ snackbarOpen: true });
    const { result } = renderHook(() => useShowToast());

    expect(result.current.isToastVisible).toBe(true);
  });
});
