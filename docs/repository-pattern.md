# Repository Pattern

The Repository Pattern provides a unified interface for data access, abstracting away the underlying data sources and providing a clean API for components to interact with data.

## Purpose

- **Abstraction**: Hide complex data fetching logic behind simple interfaces
- **Consistency**: Standardize how components access data across the application
- **Testing**: Enable easy mocking of data sources for unit tests
- **Caching**: Integrate React Query for automatic caching and state management

## Structure

```typescript
// Repository interface defines the contract
export interface EntityRepository {
  queries: EntityQueriesRepository;
  mutations: EntityMutationsRepository;
  queryKeys: typeof entityQueryKeys;
  queryOptions: typeof entityQueryOptions;
  mutationOptions: typeof entityMutationOptions;
}

// Queries repository handles read operations
export interface EntityQueriesRepository extends BaseRepository {
  useEntities: (
    filters?: EntityFilters,
    dataSource?: DataSource,
    options?: QueryOptions,
  ) => UseQueryResult<Entity[], Error>;
  useEntity: (id: string | number, dataSource?: DataSource, options?: QueryOptions) => UseQueryResult<Entity, Error>;

  // Prefetch methods
  prefetch: {
    prefetchEntities: (filters?: EntityFilters, options?: PrefetchOptions) => Promise<void>;
  };

  // Cancellation methods
  cancel: {
    cancelEntities: (filters?: EntityFilters) => Promise<void>;
    cancelEntity: (id: string | number) => Promise<void>;
    cancelAll: () => Promise<void>;
  };
}

// Mutations repository handles write operations
export interface EntityMutationsRepository {
  useCreateEntity: (
    dataSource?: DataSource,
    options?: MutationOptions,
  ) => UseMutationResult<Entity, Error, CreateEntityRequest>;
  useUpdateEntity: (
    dataSource?: DataSource,
    options?: MutationOptions,
  ) => UseMutationResult<Entity, Error, { id: string | number; data: UpdateEntityRequest }>;
  useDeleteEntity: (
    dataSource?: DataSource,
    options?: MutationOptions,
  ) => UseMutationResult<void, Error, string | number>;
}
```

## Implementation

### 1. Query Options Factory

```typescript
// entity.query-options.ts
import { createPrefetchableQuery } from '@/core/lib/react-query';
import { createEntityGateway } from './gateways';

const getEntitiesQueryOptions = (filters?: EntityFilters, dataSource: DataSource = 'http') => ({
  queryKey: ['entities', { filters, dataSource }],
  queryFn: async ({ signal }: { signal?: AbortSignal }) => {
    const gateway = createEntityGateway(dataSource);
    return gateway.findAll(filters, { signal });
  },
});

const getEntityQueryOptions = (id: string | number, dataSource: DataSource = 'http') => ({
  queryKey: ['entities', id, { dataSource }],
  queryFn: async ({ signal }: { signal?: AbortSignal }) => {
    const gateway = createEntityGateway(dataSource);
    return gateway.findById(id, { signal });
  },
});

export const entityQueryOptions = {
  entities: createPrefetchableQuery(getEntitiesQueryOptions),
  entity: createPrefetchableQuery(getEntityQueryOptions),
} as const;
```

### 2. Query Repository Implementation

```typescript
// entity.repository.queries.ts
import { useQuery } from '@tanstack/react-query';
import { createCancellationHelpers, createPrefetchHelpers } from '@/core/lib/react-query';
import { entityQueryOptions } from './entity.query-options';

const createEntityQueriesRepository = (): EntityQueriesRepository => {
  // Prefetch helpers
  const prefetchHelpers = createPrefetchHelpers({
    prefetchEntities: entityQueryOptions.entities,
  });

  // Cancellation helpers
  const cancellationHelpers = createCancellationHelpers({
    cancelEntities: (filters?: EntityFilters) => ['entities', { filters }],
    cancelEntity: (id: string | number) => ['entities', id],
    cancelAll: () => ['entities'],
  });

  return {
    // Query hooks
    useEntities: (filters, dataSource = 'http', options) => {
      const queryOptions = entityQueryOptions.entities(filters, dataSource);
      return useQuery({ ...queryOptions, ...options });
    },

    useEntity: (id, dataSource = 'http', options) => {
      const queryOptions = entityQueryOptions.entity(id, dataSource);
      return useQuery({ ...queryOptions, ...options });
    },

    // Prefetch methods
    prefetch: prefetchHelpers,

    // Cancellation methods
    cancel: cancellationHelpers,
  };
};

export const entityRepository = {
  queries: createEntityQueriesRepository(),
  mutations: createEntityMutationsRepository(), // From mutations file
  queryKeys: entityQueryKeys,
  queryOptions: entityQueryOptions,
  mutationOptions: entityMutationOptions,
};
```

### 3. Mutation Repository Implementation

```typescript
// entity.repository.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entityMutationOptions } from './entity.query-options';

const createEntityMutationsRepository = (): EntityMutationsRepository => ({
  useCreateEntity: (dataSource = 'http', options) => {
    const queryClient = useQueryClient();
    const mutationOptions = entityMutationOptions.create(dataSource);

    return useMutation({
      ...mutationOptions,
      ...options,
      onSuccess: (data, variables, context) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['entities'] });
        options?.onSuccess?.(data, variables, context);
      },
    });
  },

  useUpdateEntity: (dataSource = 'http', options) => {
    const queryClient = useQueryClient();
    const mutationOptions = entityMutationOptions.update(dataSource);

    return useMutation({
      ...mutationOptions,
      ...options,
      onSuccess: (data, variables, context) => {
        // Update specific entity in cache
        queryClient.setQueryData(['entities', variables.id], data);
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: ['entities'], exact: false });
        options?.onSuccess?.(data, variables, context);
      },
    });
  },

  useDeleteEntity: (dataSource = 'http', options) => {
    const queryClient = useQueryClient();
    const mutationOptions = entityMutationOptions.delete(dataSource);

    return useMutation({
      ...mutationOptions,
      ...options,
      onSuccess: (data, variables, context) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: ['entities', variables] });
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: ['entities'], exact: false });
        options?.onSuccess?.(data, variables, context);
      },
    });
  },
});
```

## Usage in Components

```typescript
// In a business hook or component
export const useEntityManagement = (dataSource: DataSource = 'http') => {
  // Use repository methods
  const entitiesQuery = entityRepository.queries.useEntities(filters, dataSource);
  const createMutation = entityRepository.mutations.useCreateEntity(dataSource);

  // Business logic
  const createEntity = useCallback(
    async (data: CreateEntityRequest) => {
      if (!data.name?.trim()) {
        throw new Error('Name is required');
      }

      return createMutation.mutate({
        ...data,
        name: data.name.trim(),
        createdAt: new Date().toISOString(),
      });
    },
    [createMutation],
  );

  return {
    entities: entitiesQuery.data,
    isLoading: entitiesQuery.isLoading,
    createEntity,
    isCreating: createMutation.isPending,
  };
};
```

## Benefits

### ✅ Advantages

1. **Consistent API**: All data access follows the same patterns
2. **React Query Integration**: Automatic caching, background updates, and optimistic updates
3. **Data Source Flexibility**: Easy to switch between HTTP, localStorage, or other sources
4. **Type Safety**: Full TypeScript support with proper error handling
5. **Testing**: Easy to mock repositories for unit tests
6. **Performance**: Built-in query optimization and cancellation
7. **Developer Experience**: Predictable patterns across all features

### ⚠️ Trade-offs

1. **Initial Setup**: More boilerplate than direct API calls
2. **Abstraction Layer**: Additional complexity for simple CRUD operations
3. **Learning Curve**: Developers need to understand React Query patterns

## Best Practices

### 1. Consistent Naming

```typescript
// ✅ Good - consistent naming patterns
entityRepository.queries.useEntities();
entityRepository.queries.useEntity();
entityRepository.mutations.useCreateEntity();

// ❌ Avoid - inconsistent naming
entityRepository.queries.getEntities();
entityRepository.queries.fetchEntity();
entityRepository.mutations.addEntity();
```

### 2. Proper Error Handling

```typescript
// ✅ Good - handle errors appropriately
const entitiesQuery = entityRepository.queries.useEntities(filters, dataSource, {
  retry: 3,
  retryDelay: 1000,
  onError: (error) => {
    console.error('Failed to load entities:', error);
    showErrorToast('Failed to load data');
  },
});
```

### 3. Optimistic Updates

```typescript
// ✅ Good - implement optimistic updates for better UX
const updateMutation = entityRepository.mutations.useUpdateEntity(dataSource, {
  onMutate: async (newEntity) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['entities']);

    // Snapshot previous value
    const previousEntities = queryClient.getQueryData(['entities']);

    // Optimistically update
    queryClient.setQueryData(['entities'], (old) =>
      old?.map((entity) => (entity.id === newEntity.id ? { ...entity, ...newEntity.data } : entity)),
    );

    return { previousEntities };
  },
  onError: (err, newEntity, context) => {
    // Rollback on error
    queryClient.setQueryData(['entities'], context.previousEntities);
  },
});
```

### 4. Query Key Management

```typescript
// ✅ Good - centralized query key management
export const entityQueryKeys = {
  all: ['entities'] as const,
  lists: () => [...entityQueryKeys.all, 'list'] as const,
  list: (filters: EntityFilters) => [...entityQueryKeys.lists(), { filters }] as const,
  details: () => [...entityQueryKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...entityQueryKeys.details(), id] as const,
};
```

## Testing

```typescript
// Mock repository for testing
const mockEntityRepository = {
  queries: {
    useEntities: jest.fn(),
    useEntity: jest.fn(),
  },
  mutations: {
    useCreateEntity: jest.fn(),
    useUpdateEntity: jest.fn(),
    useDeleteEntity: jest.fn(),
  },
};

// Test business logic independently
test('should create entity with validation', async () => {
  const mockMutation = {
    mutate: jest.fn(),
    isPending: false,
  };

  mockEntityRepository.mutations.useCreateEntity.mockReturnValue(mockMutation);

  const { result } = renderHook(() => useEntityManagement());

  await act(async () => {
    await result.current.createEntity({ name: '  Test Entity  ' });
  });

  expect(mockMutation.mutate).toHaveBeenCalledWith({
    name: 'Test Entity',
    createdAt: expect.any(String),
  });
});
```

## Related Patterns

- [Gateway Pattern](./gateway-pattern.md) - Data source abstraction
- [Query Options Pattern](./query-options-pattern.md) - React Query configuration
- [Hook Patterns](./hook-patterns.md) - Business and Controller hooks
