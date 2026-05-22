/**
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, renderWithProviders, screen } from '@test/utils';

import { useLoginBusiness, useLoginController } from './hooks';
import { LoginView } from './login.view';

// Mock hooks used inside the view
jest.mock('./hooks', () => ({
  useLoginBusiness: jest.fn(),
  useLoginController: jest.fn(),
}));

const mockedUseLoginBusiness = useLoginBusiness as jest.MockedFunction<typeof useLoginBusiness>;
const mockedUseLoginController = useLoginController as jest.MockedFunction<typeof useLoginController>;

describe('LoginView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (overrides: any = {}) => {
    const loginFn = jest.fn().mockResolvedValue(undefined);

    mockedUseLoginBusiness.mockReturnValue({
      login: loginFn,
      isLoading: false,
      error: null,
      ...overrides.business,
    });

    mockedUseLoginController.mockReturnValue({
      credentials: { email: 'user@example.com', password: 'secret' },
      handleEmailChange: jest.fn(),
      handlePasswordChange: jest.fn(),
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault();
        fn({ email: 'user@example.com', password: 'secret' });
      },
      ...overrides.controller,
    });

    const utils = renderWithProviders(<LoginView />, {
      queryClientOptions: { retry: false },
    });

    return { loginFn, ...utils };
  };

  it('should render form fields and submit button', () => {
    setup();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should call login on submit', () => {
    const { loginFn } = setup();

    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.click(submitButton);

    expect(loginFn).toHaveBeenCalledWith({ email: 'user@example.com', password: 'secret' });
  });

  it('should show loading state', () => {
    setup({ business: { isLoading: true } });

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  it('should display error message when error exists', () => {
    const error = new Error('Invalid credentials');

    setup({ business: { error } });

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
