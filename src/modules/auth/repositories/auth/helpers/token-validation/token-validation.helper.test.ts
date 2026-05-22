/**
 * @jest-environment jsdom
 */

import {
  decodeTokenPayload,
  getExpirationFromToken,
  getTimeUntilExpiration,
  isTokenExpired,
  needsRefresh,
} from './token-validation.helper';

describe('token-validation.helper', () => {
  const baseNow = new Date('2025-01-01T00:00:00.000Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(baseNow);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('isTokenExpired', () => {
    it('returns true for empty expiration', () => {
      expect(isTokenExpired('')).toBe(true);
    });

    it('returns false when expiration in future', () => {
      const future = '2025-01-01T00:05:00.000Z';

      expect(isTokenExpired(future)).toBe(false);
    });

    it('returns true when expiration passed', () => {
      const past = '2024-12-31T23:59:59.000Z';

      expect(isTokenExpired(past)).toBe(true);
    });
  });

  describe('getTimeUntilExpiration', () => {
    it('returns 0 for empty string', () => {
      expect(getTimeUntilExpiration('')).toBe(0);
    });

    it('returns positive ms for future date', () => {
      const future = '2025-01-01T00:01:00.000Z';

      expect(getTimeUntilExpiration(future)).toBe(60_000);
    });

    it('returns 0 when already expired', () => {
      const past = '2024-12-31T23:59:00.000Z';

      expect(getTimeUntilExpiration(past)).toBe(0);
    });
  });

  describe('needsRefresh', () => {
    it('returns false when already expired (timeRemaining 0)', () => {
      const past = '2024-12-31T23:59:00.000Z';

      expect(needsRefresh(past)).toBe(false);
    });

    it('returns true when within default 5 minute threshold', () => {
      const within = '2025-01-01T00:04:30.000Z'; // 4.5 minutes

      expect(needsRefresh(within)).toBe(true);
    });

    it('returns false when above threshold', () => {
      const above = '2025-01-01T00:06:00.000Z';

      expect(needsRefresh(above)).toBe(false);
    });

    it('respects custom threshold', () => {
      const withinCustom = '2025-01-01T00:02:30.000Z';

      expect(needsRefresh(withinCustom, 3)).toBe(true); // 2.5 < 3
    });
  });

  describe('decodeTokenPayload', () => {
    // header {"alg":"HS256","typ":"JWT"}
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));

    it('returns null for malformed token', () => {
      expect(decodeTokenPayload('invalid.token')).toBeNull();
    });

    it('decodes valid payload', () => {
      const payloadObj = { sub: '123', name: 'John', exp: 1735689600 }; // sample exp
      const payload = btoa(JSON.stringify(payloadObj));
      const token = `${header}.${payload}.signature`;

      expect(decodeTokenPayload(token)).toEqual(payloadObj);
    });

    it('returns null on invalid base64 JSON', () => {
      const token = `${header}.@@@.signature`;

      expect(decodeTokenPayload(token)).toBeNull();
    });
  });

  describe('getExpirationFromToken', () => {
    it('returns null when payload has no exp', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: '123' }));
      const token = `${header}.${payload}.sig`;

      expect(getExpirationFromToken(token)).toBeNull();
    });

    it('converts exp unix to ISO string', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const exp = Math.floor(baseNow.getTime() / 1000) + 3600; // +1h
      const payload = btoa(JSON.stringify({ exp }));
      const token = `${header}.${payload}.sig`;

      expect(getExpirationFromToken(token)).toBe(new Date(exp * 1000).toISOString());
    });
  });
});
