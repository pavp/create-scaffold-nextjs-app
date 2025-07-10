import React from 'react';
import { renderWithProviders, screen } from '@test/utils/test-utils';

import { LoadingIndicator } from './loading-indicator';

describe('LoadingIndicator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the loading', () => {
    renderWithProviders(<LoadingIndicator />);

    const loadingImg = screen.getByTestId('circular-progress');

    expect(loadingImg).toBeVisible();
  });
});
