# Selector Pattern

The Selector Pattern provides reusable hooks for selecting and computing derived state from various data sources. Selectors encapsulate complex data selection logic and enable consistent data access across components.

## Purpose

- **Data Selection**: Extract specific data from complex state structures
- **Derived State**: Compute values based on existing state
- **Reusability**: Share data selection logic across multiple components
- **Performance**: Memoize expensive calculations and prevent unnecessary re-renders
- **Consistency**: Standardize how components access state

## Structure

```typescript
// Selector hook interface
export interface SelectorHook<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch?: () => void;
}

// Selector with parameters
export interface ParameterizedSelectorHook<T, P> {
  (params: P): SelectorHook<T>;
}
```

## Implementation Examples

### 1. Simple Data Selector

```typescript
// selectors/use-completed-entities-selector/use-completed-entities-selector.hook.ts
import { useMemo } from 'react';
import { entityRepository } from '@/modules/entity/repositories/entity';
import type { DataSource } from '@/shared/gateways/base-gateway.types';

/**
 * Selector for completed entities
 * Filters entities by completion status
 */
export const useCompletedEntitiesSelector = (dataSource: DataSource = 'http') => {
  const entitiesQuery = entityRepository.queries.useEntities(undefined, dataSource);

  const completedEntities = useMemo(() => {
    if (!entitiesQuery.data) return undefined;

    return entitiesQuery.data.filter((entity) => entity.status === 'completed');
  }, [entitiesQuery.data]);

  return {
    data: completedEntities,
    isLoading: entitiesQuery.isLoading,
    error: entitiesQuery.error,
    refetch: entitiesQuery.refetch,
  };
};
```

### 2. Parameterized Selector

```typescript
// selectors/use-filtered-entities-selector/use-filtered-entities-selector.hook.ts
import { useMemo } from 'react';
import { entityRepository } from '@/modules/entity/repositories/entity';
import { filterEntities } from '@/modules/entity/repositories/entity/helpers/filter-entities';
import type { EntityFilters } from '@/modules/entity/entity.types';
import type { DataSource } from '@/shared/gateways/base-gateway.types';

/**
 * Selector for filtered entities
 * Applies client-side filtering to entities
 */
export const useFilteredEntitiesSelector = (filters: EntityFilters, dataSource: DataSource = 'http') => {
  const entitiesQuery = entityRepository.queries.useEntities(undefined, dataSource);

  const filteredEntities = useMemo(() => {
    if (!entitiesQuery.data) return undefined;

    return filterEntities(entitiesQuery.data, filters);
  }, [entitiesQuery.data, filters]);

  const count = useMemo(() => {
    return filteredEntities?.length ?? 0;
  }, [filteredEntities]);

  return {
    data: filteredEntities,
    count,
    isLoading: entitiesQuery.isLoading,
    error: entitiesQuery.error,
    refetch: entitiesQuery.refetch,
  };
};
```

### 3. Complex Computed Selector

```typescript
// selectors/use-entity-stats-selector/use-entity-stats-selector.hook.ts
import { useMemo } from 'react';
import { entityRepository } from '@/modules/entity/repositories/entity';
import type { DataSource } from '@/shared/gateways/base-gateway.types';

export interface EntityStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  averageCompletionTime: number;
  statusDistribution: Record<string, number>;
  priorityDistribution: Record<string, number>;
  recentActivity: {
    createdThisWeek: number;
    completedThisWeek: number;
    updatedToday: number;
  };
}

/**
 * Selector for comprehensive entity statistics
 * Computes various metrics and aggregations
 */
export const useEntityStatsSelector = (dataSource: DataSource = 'http') => {
  const entitiesQuery = entityRepository.queries.useEntities(undefined, dataSource);

  const stats = useMemo((): EntityStats | undefined => {
    if (!entitiesQuery.data) return undefined;

    const entities = entitiesQuery.data;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Basic counts
    const total = entities.length;
    const completed = entities.filter((e) => e.status === 'completed').length;
    const pending = entities.filter((e) => e.status === 'pending').length;

    // Overdue calculation
    const overdue = entities.filter((e) => e.dueDate && new Date(e.dueDate) < now && e.status !== 'completed').length;

    // Completion rate
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // Average completion time
    const completedEntities = entities.filter((e) => e.status === 'completed' && e.completedAt);
    const averageCompletionTime =
      completedEntities.length > 0
        ? completedEntities.reduce((acc, entity) => {
            const created = new Date(entity.createdAt);
            const completed = new Date(entity.completedAt!);
            return acc + (completed.getTime() - created.getTime());
          }, 0) /
          completedEntities.length /
          (1000 * 60 * 60 * 24) // Convert to days
        : 0;

    // Status distribution
    const statusDistribution = entities.reduce(
      (acc, entity) => {
        acc[entity.status] = (acc[entity.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Priority distribution
    const priorityDistribution = entities.reduce(
      (acc, entity) => {
        const priority = entity.priority || 'medium';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Recent activity
    const createdThisWeek = entities.filter((e) => new Date(e.createdAt) >= weekAgo).length;

    const completedThisWeek = entities.filter((e) => e.completedAt && new Date(e.completedAt) >= weekAgo).length;

    const updatedToday = entities.filter((e) => new Date(e.updatedAt) >= todayStart).length;

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimals
      averageCompletionTime: Math.round(averageCompletionTime * 100) / 100,
      statusDistribution,
      priorityDistribution,
      recentActivity: {
        createdThisWeek,
        completedThisWeek,
        updatedToday,
      },
    };
  }, [entitiesQuery.data]);

  return {
    data: stats,
    isLoading: entitiesQuery.isLoading,
    error: entitiesQuery.error,
    refetch: entitiesQuery.refetch,
  };
};
```

### 4. Multi-Source Selector

```typescript
// selectors/use-entity-comparison-selector/use-entity-comparison-selector.hook.ts
import { useMemo } from 'react';
import { entityRepository } from '@/modules/entity/repositories/entity';
import type { DataSource } from '@/shared/gateways/base-gateway.types';

export interface EntityComparison {
  httpData: Entity[];
  localData: Entity[];
  differences: {
    onlyInHttp: Entity[];
    onlyInLocal: Entity[];
    modified: Array<{
      id: string | number;
      http: Entity;
      local: Entity;
      changes: string[];
    }>;
  };
  syncStatus: 'in-sync' | 'out-of-sync' | 'local-only' | 'remote-only';
}

/**
 * Selector for comparing entities across different data sources
 * Useful for sync status and conflict resolution
 */
export const useEntityComparisonSelector = () => {
  const httpQuery = entityRepository.queries.useEntities(undefined, 'http');
  const localQuery = entityRepository.queries.useEntities(undefined, 'localStorage');

  const comparison = useMemo((): EntityComparison | undefined => {
    if (!httpQuery.data || !localQuery.data) return undefined;

    const httpData = httpQuery.data;
    const localData = localQuery.data;

    // Create maps for efficient lookup
    const httpMap = new Map(httpData.map((entity) => [entity.id, entity]));
    const localMap = new Map(localData.map((entity) => [entity.id, entity]));

    // Find differences
    const onlyInHttp = httpData.filter((entity) => !localMap.has(entity.id));
    const onlyInLocal = localData.filter((entity) => !httpMap.has(entity.id));

    const modified = [];
    for (const httpEntity of httpData) {
      const localEntity = localMap.get(httpEntity.id);
      if (localEntity) {
        const changes = [];

        if (httpEntity.name !== localEntity.name) changes.push('name');
        if (httpEntity.status !== localEntity.status) changes.push('status');
        if (httpEntity.priority !== localEntity.priority) changes.push('priority');
        if (httpEntity.updatedAt !== localEntity.updatedAt) changes.push('updatedAt');

        if (changes.length > 0) {
          modified.push({
            id: httpEntity.id,
            http: httpEntity,
            local: localEntity,
            changes,
          });
        }
      }
    }

    // Determine sync status
    let syncStatus: EntityComparison['syncStatus'];
    if (httpData.length === 0 && localData.length > 0) {
      syncStatus = 'local-only';
    } else if (localData.length === 0 && httpData.length > 0) {
      syncStatus = 'remote-only';
    } else if (onlyInHttp.length === 0 && onlyInLocal.length === 0 && modified.length === 0) {
      syncStatus = 'in-sync';
    } else {
      syncStatus = 'out-of-sync';
    }

    return {
      httpData,
      localData,
      differences: {
        onlyInHttp,
        onlyInLocal,
        modified,
      },
      syncStatus,
    };
  }, [httpQuery.data, localQuery.data]);

  return {
    data: comparison,
    isLoading: httpQuery.isLoading || localQuery.isLoading,
    error: httpQuery.error || localQuery.error,
    refetch: () => {
      httpQuery.refetch();
      localQuery.refetch();
    },
  };
};
```

### 5. Store-Based Selector (Zustand)

```typescript
// selectors/use-selected-entity-selector/use-selected-entity-selector.hook.ts
import { useEntityStore } from '@/modules/entity/stores/entity.store';
import { entityRepository } from '@/modules/entity/repositories/entity';
import type { DataSource } from '@/shared/gateways/base-gateway.types';

/**
 * Selector for the currently selected entity
 * Combines store state with repository data
 */
export const useSelectedEntitySelector = (dataSource: DataSource = 'http') => {
  const { selectedEntityId } = useEntityStore();

  const selectedEntityQuery = entityRepository.queries.useEntity(selectedEntityId!, dataSource, {
    enabled: !!selectedEntityId, // Only fetch if an entity is selected
  });

  return {
    selectedEntity: selectedEntityQuery.data,
    selectedEntityId,
    isLoading: selectedEntityQuery.isLoading,
    error: selectedEntityQuery.error,
    refetch: selectedEntityQuery.refetch,
    hasSelection: !!selectedEntityId,
  };
};
```

## Selector Index

```typescript
// selectors/index.ts
export { useCompletedEntitiesSelector } from './use-completed-entities-selector/use-completed-entities-selector.hook';
export { useFilteredEntitiesSelector } from './use-filtered-entities-selector/use-filtered-entities-selector.hook';
export { useEntityStatsSelector } from './use-entity-stats-selector/use-entity-stats-selector.hook';
export { useEntityComparisonSelector } from './use-entity-comparison-selector/use-entity-comparison-selector.hook';
export { useSelectedEntitySelector } from './use-selected-entity-selector/use-selected-entity-selector.hook';
export { useEntitiesByPrioritySelector } from './use-entities-by-priority-selector/use-entities-by-priority-selector.hook';

// Re-export types for convenience
export type { EntityStats } from './use-entity-stats-selector/use-entity-stats-selector.hook';
export type { EntityComparison } from './use-entity-comparison-selector/use-entity-comparison-selector.hook';
```

## Usage in Components

### 1. Simple Usage

```typescript
// In a component
export const EntitySummary = () => {
  const { data: stats, isLoading } = useEntityStatsSelector();

  if (isLoading) return <Skeleton />;
  if (!stats) return <EmptyState />;

  return (
    <div>
      <div>Total: {stats.total}</div>
      <div>Completed: {stats.completed}</div>
      <div>Completion Rate: {stats.completionRate}%</div>
    </div>
  );
};
```

### 2. Business Hook Integration

```typescript
// In a business hook
export const useEntityManagement = (dataSource: DataSource = 'http') => {
  const { data: entities, isLoading } = useFilteredEntitiesSelector(filters, dataSource);
  const { data: stats } = useEntityStatsSelector(dataSource);
  const { selectedEntity } = useSelectedEntitySelector(dataSource);

  // Business logic using selector data
  const summary = useMemo(() => {
    if (!entities || !stats) return null;

    return {
      displayEntities: entities,
      totalCount: stats.total,
      completionRate: stats.completionRate,
      hasSelection: !!selectedEntity,
    };
  }, [entities, stats, selectedEntity]);

  return {
    entities,
    stats,
    selectedEntity,
    summary,
    isLoading,
  };
};
```

## Performance Optimization

### 1. Memoization

```typescript
// ✅ Good - memoize expensive calculations
export const useEntityStatsSelector = (dataSource: DataSource = 'http') => {
  const entitiesQuery = entityRepository.queries.useEntities(undefined, dataSource);

  // Memoize expensive computation
  const stats = useMemo(() => {
    if (!entitiesQuery.data) return undefined;

    // Expensive calculation only runs when data changes
    return calculateComplexStats(entitiesQuery.data);
  }, [entitiesQuery.data]); // Only recalculate when data changes

  return { data: stats, isLoading: entitiesQuery.isLoading, error: entitiesQuery.error };
};
```

### 2. Selective Dependencies

```typescript
// ✅ Good - only depend on specific properties
export const useEntityTitleSelector = (entityId: string | number, dataSource: DataSource = 'http') => {
  const entityQuery = entityRepository.queries.useEntity(entityId, dataSource);

  // Only recalculate when title changes, not other properties
  const formattedTitle = useMemo(() => {
    if (!entityQuery.data?.name) return undefined;

    return entityQuery.data.name.charAt(0).toUpperCase() + entityQuery.data.name.slice(1);
  }, [entityQuery.data?.name]); // Only depend on name, not entire object

  return {
    title: formattedTitle,
    isLoading: entityQuery.isLoading,
    error: entityQuery.error,
  };
};
```

### 3. Conditional Execution

```typescript
// ✅ Good - conditional queries
export const useSelectedEntityDetailsSelector = (dataSource: DataSource = 'http') => {
  const { selectedEntityId } = useEntityStore();

  const entityQuery = entityRepository.queries.useEntity(selectedEntityId!, dataSource, {
    enabled: !!selectedEntityId, // Only run query if entity is selected
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    entity: entityQuery.data,
    isLoading: entityQuery.isLoading,
    error: entityQuery.error,
    hasSelection: !!selectedEntityId,
  };
};
```

## Testing Selectors

```typescript
// use-entity-stats-selector.hook.test.ts
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEntityStatsSelector } from './use-entity-stats-selector.hook';

// Mock the repository
jest.mock('@/modules/entity/repositories/entity', () => ({
  entityRepository: {
    queries: {
      useEntities: jest.fn(),
    },
  },
}));

const mockEntityRepository = require('@/modules/entity/repositories/entity').entityRepository;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useEntityStatsSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate stats correctly', () => {
    const mockEntities = [
      { id: 1, status: 'completed', priority: 'high', createdAt: '2023-01-01', updatedAt: '2023-01-02' },
      { id: 2, status: 'pending', priority: 'low', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { id: 3, status: 'completed', priority: 'high', createdAt: '2023-01-01', updatedAt: '2023-01-03' },
    ];

    mockEntityRepository.queries.useEntities.mockReturnValue({
      data: mockEntities,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useEntityStatsSelector(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toEqual({
      total: 3,
      completed: 2,
      pending: 1,
      overdue: 0,
      completionRate: 66.67,
      statusDistribution: {
        completed: 2,
        pending: 1,
      },
      priorityDistribution: {
        high: 2,
        low: 1,
      },
      // ... other calculated properties
    });
  });

  it('should handle loading state', () => {
    mockEntityRepository.queries.useEntities.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useEntityStatsSelector(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
```

## Best Practices

### 1. Single Responsibility

```typescript
// ✅ Good - focused selector
export const useCompletedEntitiesSelector = (dataSource: DataSource = 'http') => {
  // Only handles completed entities logic
};

// ❌ Avoid - too many responsibilities
export const useAllEntityDataSelector = (dataSource: DataSource = 'http') => {
  // Handles completed, pending, stats, selected, etc. - too much
};
```

### 2. Consistent Naming

```typescript
// ✅ Good - consistent naming pattern
export const useCompletedEntitiesSelector = () => {
  /* ... */
};
export const useFilteredEntitiesSelector = () => {
  /* ... */
};
export const useEntityStatsSelector = () => {
  /* ... */
};

// ❌ Avoid - inconsistent naming
export const getCompletedEntities = () => {
  /* ... */
};
export const useFilteredEntities = () => {
  /* ... */
};
export const entityStatsHook = () => {
  /* ... */
};
```

### 3. Error Handling

```typescript
// ✅ Good - proper error handling
export const useEntityStatsSelector = (dataSource: DataSource = 'http') => {
  const entitiesQuery = entityRepository.queries.useEntities(undefined, dataSource);

  const stats = useMemo(() => {
    if (!entitiesQuery.data || entitiesQuery.error) return undefined;

    try {
      return calculateStats(entitiesQuery.data);
    } catch (error) {
      console.error('Failed to calculate stats:', error);
      return undefined;
    }
  }, [entitiesQuery.data, entitiesQuery.error]);

  return {
    data: stats,
    isLoading: entitiesQuery.isLoading,
    error: entitiesQuery.error,
    refetch: entitiesQuery.refetch,
  };
};
```

## Benefits

### ✅ Advantages

1. **Reusability**: Share complex data selection logic across components
2. **Performance**: Memoized calculations prevent unnecessary re-renders
3. **Consistency**: Standardized data access patterns
4. **Testability**: Easy to test data transformations independently
5. **Maintainability**: Centralized data selection logic
6. **Type Safety**: Full TypeScript support with proper return types

### ⚠️ Trade-offs

1. **Indirection**: Additional layer between components and data
2. **Complexity**: Can become complex with many selectors
3. **Over-Engineering**: Simple data access might not need selectors

## Related Patterns

- [Repository Pattern](./repository-pattern.md) - Data access layer that selectors use
- [Hook Patterns](./hook-patterns.md) - Business hooks that compose selectors
- [Store Pattern](./store-pattern.md) - Zustand stores that selectors can access
