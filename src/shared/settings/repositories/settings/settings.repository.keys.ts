// Query Keys Factory for Settings Repository
export const settingsQueryKeys = {
  all: ['settings'] as const,
  detail: (dataSource?: string) => [...settingsQueryKeys.all, dataSource] as const,
} as const;
