import { renderWithProviders } from '@test/utils/test-utils';

import * as useTrackingHook from './hooks/use-tracking/use-tracking';
import { Tracking } from './tracking';

jest.mock('./hooks/use-tracking/use-tracking');

describe('Tracking', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call useTracking hook', () => {
    const spyUseTrackingHook = jest.spyOn(useTrackingHook, 'useTracking');

    renderWithProviders(<Tracking>Hello World</Tracking>);

    expect(spyUseTrackingHook).toHaveBeenCalled();

    spyUseTrackingHook.mockRestore();
  });
});
