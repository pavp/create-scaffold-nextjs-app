import { z } from 'zod';

/**
 * Auth Types with Zod Schemas
 *
 * Core authentication types for session and token management.
 * Projects can extend these types with their specific requirements.
 */

// === ZOD SCHEMAS (SOURCE OF TRUTH) ===

// Auth credentials schema
export const AuthCredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Password is required'),
});

// Auth session schema
export const AuthSessionSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  expirationDate: z.string(),
  isAuthenticated: z.boolean().default(false),
});

// Auth login response schema
export const AuthLoginResponseSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  expirationDate: z.string(),
  user: z.record(z.string(), z.any()).optional(), // Flexible user data - projects define their own
});

// Auth validation response schema
export const AuthValidationResponseSchema = z.object({
  valid: z.boolean(),
});

// === TYPESCRIPT TYPES (DERIVED FROM SCHEMAS) ===

export type AuthCredentials = z.infer<typeof AuthCredentialsSchema>;

export type AuthSession = z.infer<typeof AuthSessionSchema>;

export type AuthLoginResponse = z.infer<typeof AuthLoginResponseSchema>;
