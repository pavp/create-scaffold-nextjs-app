import { queryOptions } from '@tanstack/react-query';

import type { DataSource } from '@/types/gateway.types';

import { createSettingsGateway } from './gateways';
import { settingsQueryKeys } from './settings.repository.keys';

// ============================================================================
// QUERY OPTIONS - for Server Components and prefetch
// ============================================================================

const getSettingsQueryOptions = (dataSource: DataSource = 'http') =>
  queryOptions({
    queryKey: settingsQueryKeys.detail(dataSource),
    queryFn: ({ signal }) => createSettingsGateway(dataSource).getSettings({ signal }),
    staleTime: 10 * 60 * 1000, // 10 minutes - settings don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

// ============================================================================
// ORGANIZED EXPORTS - separated by concern
// ============================================================================

// Query options for Server Components and prefetch
export const settingsQueryOptions = {
  settings: getSettingsQueryOptions,
} as const;
