/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@test/utils';

import { useLoginController } from './use-login-controller.hook';

describe('useLoginController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty credentials', () => {
    const { result } = renderHook(() => useLoginController());

    expect(result.current.credentials).toEqual({ email: '', password: '' });
  });

  it('should update email on handleEmailChange', () => {
    const { result } = renderHook(() => useLoginController());

    act(() => {
      result.current.handleEmailChange({ target: { value: 'test@example.com' } } as any);
    });

    expect(result.current.credentials.email).toBe('test@example.com');
  });

  it('should update password on handlePasswordChange', () => {
    const { result } = renderHook(() => useLoginController());

    act(() => {
      result.current.handlePasswordChange({ target: { value: 'secret' } } as any);
    });

    expect(result.current.credentials.password).toBe('secret');
  });

  it('should call loginFn with current credentials on submit', () => {
    const mockLoginFn = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useLoginController());

    act(() => {
      result.current.handleEmailChange({ target: { value: 'user@mail.com' } } as any);
      result.current.handlePasswordChange({ target: { value: 'pwd' } } as any);
    });

    const fakeEvent = { preventDefault: jest.fn() } as any;

    act(() => {
      const submitHandler = result.current.handleSubmit(mockLoginFn);

      submitHandler(fakeEvent);
    });

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(mockLoginFn).toHaveBeenCalledWith({ email: 'user@mail.com', password: 'pwd' });
  });

  it('should keep stable handlers (memoization)', () => {
    const { result, rerender } = renderHook(() => useLoginController());

    const emailHandler = result.current.handleEmailChange;
    const passwordHandler = result.current.handlePasswordChange;

    rerender();

    expect(result.current.handleEmailChange).toBe(emailHandler);
    expect(result.current.handlePasswordChange).toBe(passwordHandler);
  });
});
