/**
 * Token Validation Helper
 *
 * Utility functions for validating and managing authentication tokens.
 */

/**
 * Check if a token is expired based on expiration date
 */
export const isTokenExpired = (expirationDate: string): boolean => {
  if (!expirationDate) return true;

  const expiration = new Date(expirationDate);
  const now = new Date();

  return now >= expiration;
};

/**
 * Get time remaining until token expiration in milliseconds
 */
export const getTimeUntilExpiration = (expirationDate: string): number => {
  if (!expirationDate) return 0;

  const expiration = new Date(expirationDate);
  const now = new Date();
  const diff = expiration.getTime() - now.getTime();

  return diff > 0 ? diff : 0;
};

/**
 * Check if token needs refresh (expires within the threshold)
 */
export const needsRefresh = (expirationDate: string, thresholdMinutes: number = 5): boolean => {
  const timeRemaining = getTimeUntilExpiration(expirationDate);
  const thresholdMs = thresholdMinutes * 60 * 1000;

  return timeRemaining > 0 && timeRemaining <= thresholdMs;
};

/**
 * Decode JWT token payload (without verification)
 * NOTE: This is for client-side display purposes only, not for security
 */
export const decodeTokenPayload = (token: string): Record<string, any> | null => {
  try {
    const parts = token.split('.');

    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

/**
 * Extract expiration from JWT token
 */
export const getExpirationFromToken = (token: string): string | null => {
  const payload = decodeTokenPayload(token);

  if (!payload?.exp) return null;

  // Convert Unix timestamp to ISO string
  return new Date(payload.exp * 1000).toISOString();
};
