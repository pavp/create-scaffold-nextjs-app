import { makeStore } from '@/store';

import { mockToastData } from '../__mocks__';

import { clearToast, closeToast, initialState, resetToastState, setToast, toastReducer } from './slice';

describe('Toast slice', () => {
  it('should set the default values', () => {
    const slice = toastReducer(undefined, {} as any);

    expect(slice.snackbarOpen).toBe(initialState.snackbarOpen);
    expect(slice.snackbarMessage).toBe(initialState.snackbarMessage);
    expect(slice.severity).toBe(initialState.severity);
    expect(slice.onConfirmation).toBe(initialState.onConfirmation);
  });

  it('should setToast', () => {
    const store = makeStore();

    store.dispatch(setToast(mockToastData));

    expect(store.getState().toast.snackbarOpen).toBe(true);
    expect(store.getState().toast.snackbarMessage).toBe(mockToastData.snackbarMessage);
    expect(store.getState().toast.severity).toBe(mockToastData.severity);
    expect(store.getState().toast.onConfirmation).toBe(mockToastData.onConfirmation);
  });

  it('should closeToast', () => {
    const store = makeStore();

    store.dispatch(setToast(mockToastData));

    expect(store.getState().toast.snackbarOpen).toBe(true);

    store.dispatch(closeToast());

    expect(store.getState().toast.snackbarOpen).toBe(false);
  });

  it('should resetToastState', () => {
    const store = makeStore();

    store.dispatch(setToast(mockToastData));

    store.dispatch(resetToastState());

    expect(store.getState().toast.snackbarOpen).toBe(true);
    expect(store.getState().toast.snackbarMessage).toBe(initialState.snackbarMessage);
    expect(store.getState().toast.severity).toBe(initialState.severity);
    expect(store.getState().toast.onConfirmation).toBe(initialState.onConfirmation);
  });

  it('should clearToast', () => {
    const store = makeStore();

    store.dispatch(setToast(mockToastData));

    store.dispatch(clearToast());

    expect(store.getState().toast.snackbarOpen).toBe(initialState.snackbarOpen);
    expect(store.getState().toast.snackbarMessage).toBe(initialState.snackbarMessage);
    expect(store.getState().toast.severity).toBe(initialState.severity);
    expect(store.getState().toast.onConfirmation).toBe(initialState.onConfirmation);
  });
});
