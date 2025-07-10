import { makeStore } from '@/store';

import { mockToastData } from '../__mocks__';

import { selectSnackbar } from './selectors';
import { setToast } from './slice';

describe('Toast selectors', () => {
  it('should get toast data from selector', () => {
    const store = makeStore();

    store.dispatch(setToast(mockToastData));

    expect(selectSnackbar(store.getState())).toEqual({
      ...mockToastData,
      snackbarOpen: true,
    });
  });
});
