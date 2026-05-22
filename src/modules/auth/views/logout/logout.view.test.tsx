/**
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, renderWithProviders, screen } from '@test/utils';

import { useLogoutBusiness, useLogoutController } from './hooks';
import { LogoutView } from './logout.view';

jest.mock('./hooks', () => ({
  useLogoutBusiness: jest.fn(),
  useLogoutController: jest.fn(),
}));

const mockedUseLogoutBusiness = useLogoutBusiness as jest.MockedFunction<typeof useLogoutBusiness>;
const mockedUseLogoutController = useLogoutController as jest.MockedFunction<typeof useLogoutController>;

describe('LogoutView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (overrides: any = {}) => {
    const logoutFn = jest.fn().mockResolvedValue(undefined);

    mockedUseLogoutBusiness.mockReturnValue({
      logout: logoutFn,
      isAuthenticated: true,
      ...overrides.business,
    });

    mockedUseLogoutController.mockReturnValue({
      showConfirmation: false,
      handleLogoutClick: jest.fn(),
      handleConfirmLogout: (fn: any) => () => fn(),
      handleCancelLogout: jest.fn(),
      ...overrides.controller,
    });

    return { logoutFn, ...renderWithProviders(<LogoutView />) };
  };

  it('should render logout button when authenticated and no confirmation', () => {
    setup();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should show not logged in message when not authenticated', () => {
    setup({ business: { isAuthenticated: false } });
    expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
  });

  it('should show confirmation buttons when showConfirmation is true', () => {
    setup({ controller: { showConfirmation: true } });
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yes, logout/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should trigger logout through confirm flow', () => {
    const { logoutFn } = setup({ controller: { showConfirmation: true } });

    fireEvent.click(screen.getByRole('button', { name: /yes, logout/i }));
    expect(logoutFn).toHaveBeenCalled();
  });
});
