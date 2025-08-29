/**
 * @jest-environment jsdom
 */
import { authApi } from '@/modules/auth/api/auth-api';

import { createHttpAuthGateway } from './http-gateway';

jest.mock('@/modules/auth/api/auth-api', () => {
  return {
    authApi: {
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      validateSession: jest.fn(),
    },
  };
});

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;

describe('createHttpAuthGateway', () => {
  const gatewayFactory = () => createHttpAuthGateway();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates login and returns value', async () => {
    const response = { token: 'jwt', refreshToken: 'r', expiration: '2025-01-01T00:00:00.000Z' } as any;

    mockedAuthApi.login.mockResolvedValue(response);

    const gateway = gatewayFactory();
    const creds = { username: 'u', password: 'p' } as any;
    const options = { signal: new AbortController().signal } as any;

    const result = await gateway.login(creds, options);

    expect(mockedAuthApi.login).toHaveBeenCalledWith(creds, options);
    expect(result).toBe(response);
  });

  it('delegates logout', async () => {
    mockedAuthApi.logout.mockResolvedValue(undefined);
    const gateway = gatewayFactory();
    const options = { signal: new AbortController().signal } as any;

    await gateway.logout(options);

    expect(mockedAuthApi.logout).toHaveBeenCalledWith(options);
  });

  it('delegates refreshToken and returns value', async () => {
    const response = { token: 'new', refreshToken: 'nr', expiration: '2025-01-02T00:00:00.000Z' } as any;

    mockedAuthApi.refreshToken.mockResolvedValue(response);
    const gateway = gatewayFactory();

    const result = await gateway.refreshToken('old-token');

    expect(mockedAuthApi.refreshToken).toHaveBeenCalledWith('old-token', undefined);
    expect(result).toBe(response);
  });

  it('delegates validateSession and maps boolean', async () => {
    mockedAuthApi.validateSession.mockResolvedValue({ valid: true });
    const gateway = gatewayFactory();

    const result = await gateway.validateSession('token');

    expect(mockedAuthApi.validateSession).toHaveBeenCalledWith('token', undefined);
    expect(result).toBe(true);
  });

  it('propagates errors from underlying api', async () => {
    const error = new Error('network');

    mockedAuthApi.login.mockRejectedValue(error);
    const gateway = gatewayFactory();

    await expect(gateway.login({} as any)).rejects.toThrow('network');
  });

  it('returns source info with expected shape', () => {
    const { getSourceInfo } = gatewayFactory();
    const info = getSourceInfo();

    expect(info).toEqual({
      type: 'http',
      name: expect.stringContaining('HTTP Auth Gateway'),
      capabilities: {
        offline: false,
        realtime: true,
        persistence: true,
      },
    });
  });
});
