// Query Keys Factory for Auth Repository
export const authQueryKeys = {
  all: ['auth'] as const,
  session: () => [...authQueryKeys.all, 'session'] as const,
  validate: (token: string) => [...authQueryKeys.session(), 'validate', token] as const,
} as const;
