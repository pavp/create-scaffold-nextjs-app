# Developer Guide

This guide provides step-by-step instructions for creating new modules and extending existing functionality following the established architectural patterns.

## Getting Started

Before creating a new module, familiarize yourself with the core patterns:

- [Module Architecture](./module-architecture.md) - Overall structure and principles
- [Repository Pattern](./repository-pattern.md) - Data access abstraction
- [Gateway Pattern](./gateway-pattern.md) - Data source abstraction
- [Selector Pattern](./selector-pattern.md) - State selection and derivation
- [Hook Patterns](./hook-patterns.md) - Business and Controller separation

## Creating a New Module

### Step 1: Module Structure Setup

Create the basic module structure:

```bash
src/modules/[module-name]/
├── api/                          # HTTP client integration
│   ├── [module-name]-api.ts
│   └── [module-name]-api.test.ts
├── components/                   # Reusable components
│   ├── index.ts
│   └── [component-name]/
│       ├── [component-name].component.tsx
│       └── [component-name].component.test.tsx
├── hooks/                        # Shared hooks
│   ├── index.ts
│   └── use-[hook-name]/
│       ├── use-[hook-name].hook.ts
│       └── use-[hook-name].hook.test.ts
├── repositories/                 # Data access layer
│   └── [module-name]/
│       ├── index.ts
│       ├── [module-name].query-options.ts
│       ├── [module-name].repository.keys.ts
│       ├── [module-name].repository.queries.ts
│       ├── [module-name].repository.mutations.ts
│       ├── [module-name].repository.types.ts
│       ├── gateways/
│       │   ├── index.ts
│       │   ├── [module-name].gateway.types.ts
│       │   ├── http-gateway/
│       │   ├── local-storage-gateway/
│       │   └── mock-gateway/
│       └── helpers/
├── selectors/                    # State selection hooks
│   ├── index.ts
│   └── use-[selector-name]-selector/
├── stores/                       # Global state management
│   ├── index.ts
│   ├── [module-name].store.ts
│   ├── [module-name].store.test.ts
│   └── [module-name].store.types.ts
├── views/                        # Feature views
│   ├── index.ts
│   └── [view-name]/
│       ├── [view-name].view.tsx
│       ├── [view-name].view.test.tsx
│       ├── hooks/
│       │   ├── use-[view-name]-business/
│       │   └── use-[view-name]-controller/
│       └── helpers/
├── index.ts                      # Module exports
├── [module-name].types.ts        # TypeScript definitions
```

### Step 2: Define Types

Start by defining the core types for your module:

```typescript
// [module-name].types.ts
export interface Entity {
  id: string | number;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface CreateEntityRequest {
  name: string;
  status?: Entity['status'];
  priority?: Entity['priority'];
  description?: string;
}

export interface UpdateEntityRequest extends Partial<CreateEntityRequest> {}

export interface EntityFilters {
  status?: Entity['status'];
  priority?: Entity['priority'];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export type ErrorType = 'network' | 'server' | 'validation' | 'zod-request' | 'zod-response';

// Zod schemas for validation
export const EntitySchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().min(1),
  status: z.enum(['active', 'inactive', 'pending']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().optional(),
});

export const CreateEntitySchema = EntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateEntitySchema = CreateEntitySchema.partial();

export const EntityFiltersSchema = z.object({
  status: EntitySchema.shape.status.optional(),
  priority: EntitySchema.shape.priority.optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const EntityArraySchema = z.array(EntitySchema);
```

### Step 3: Create API Layer

Implement the HTTP client integration:

```typescript
// api/[module-name]-api.ts
import { z } from 'zod';
import { Endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/http-client';
import type {
  Entity,
  EntityFilters,
  CreateEntityRequest,
  UpdateEntityRequest,
  ErrorType,
} from '../[module-name].types';
import {
  EntitySchema,
  EntityArraySchema,
  EntityFiltersSchema,
  CreateEntitySchema,
  UpdateEntitySchema,
} from '../[module-name].types';

// API options for supporting cancellation
export interface ApiOptions {
  signal?: AbortSignal;
}

// Contract interface
export interface EntityApiContract {
  getAll(filters?: EntityFilters, options?: ApiOptions): Promise<Entity[]>;
  getById(id: string | number, options?: ApiOptions): Promise<Entity>;
  create(entity: CreateEntityRequest, options?: ApiOptions): Promise<Entity>;
  update(id: string | number, entity: UpdateEntityRequest, options?: ApiOptions): Promise<Entity>;
  delete(id: string | number, options?: ApiOptions): Promise<void>;
  testError(type: ErrorType, options?: ApiOptions): Promise<any>;
}

// Service implementation with Zod validation
const createEntityApiService = (): EntityApiContract => ({
  async getAll(filters = {}, options) {
    const response = await httpClient.get<Entity[]>(Endpoints.ENTITY.BASE, {
      params: filters,
      requestSchema: EntityFiltersSchema,
      responseSchema: EntityArraySchema,
      signal: options?.signal,
    });

    return response.data;
  },

  async getById(id, options) {
    const response = await httpClient.get<Entity>(Endpoints.ENTITY.BY_ID(id), {
      responseSchema: EntitySchema,
      signal: options?.signal,
    });

    return response.data;
  },

  async create(entity, options) {
    const response = await httpClient.post<Entity>(Endpoints.ENTITY.BASE, entity, {
      requestSchema: CreateEntitySchema,
      responseSchema: EntitySchema,
      signal: options?.signal,
    });

    return response.data;
  },

  async update(id, entity, options) {
    const response = await httpClient.put<Entity>(Endpoints.ENTITY.BY_ID(id), entity, {
      requestSchema: UpdateEntitySchema,
      responseSchema: EntitySchema,
      signal: options?.signal,
    });

    return response.data;
  },

  async delete(id, options) {
    await httpClient.delete(Endpoints.ENTITY.BY_ID(id), {
      signal: options?.signal,
    });
  },

  async testError(type, options) {
    const response = await httpClient.get(Endpoints.ENTITY.TEST_ERRORS, {
      params: { type },
      signal: options?.signal,
    });

    return response.data;
  },
});

// Singleton instance for the entire app
export const entityApi = createEntityApiService();
```

### Step 4: Create Gateway Interfaces

Define the gateway contract:

```typescript
// repositories/[module-name]/gateways/[module-name].gateway.types.ts
import type { BaseGateway, GatewayOptions } from '@/shared/gateways/base-gateway.types';
import type {
  Entity,
  EntityFilters,
  CreateEntityRequest,
  UpdateEntityRequest,
  ErrorType,
} from '../../../[module-name].types';

// Entity-specific gateway interface extending the base gateway
export interface EntityGateway extends BaseGateway {
  findAll(filters?: EntityFilters, options?: GatewayOptions): Promise<Entity[]>;
  findById(id: string | number, options?: GatewayOptions): Promise<Entity>;
  create(entity: CreateEntityRequest, options?: GatewayOptions): Promise<Entity>;
  update(id: string | number, entity: UpdateEntityRequest, options?: GatewayOptions): Promise<Entity>;
  delete(id: string | number, options?: GatewayOptions): Promise<void>;
  testError(type: ErrorType, options?: GatewayOptions): Promise<any>;
}
```

### Step 5: Implement Gateways

Create the HTTP gateway:

```typescript
// repositories/[module-name]/gateways/http-gateway/http-gateway.ts
import { entityApi } from '@/modules/[module-name]/api/[module-name]-api';
import { validateEntityData } from '../../helpers/validation/validation.helper';
import type { EntityGateway } from '../[module-name].gateway.types';

export const createHttpEntityGateway = (): EntityGateway => {
  return {
    async findAll(filters, options) {
      return entityApi.getAll(filters, options);
    },

    async findById(id, options) {
      return entityApi.getById(id, options);
    },

    async create(entity, options) {
      validateEntityData(entity);
      return entityApi.create(entity, options);
    },

    async update(id, entity, options) {
      if (entity.name !== undefined) {
        validateEntityData({ name: entity.name });
      }
      return entityApi.update(id, entity, options);
    },

    async delete(id, options) {
      await entityApi.delete(id, options);
    },

    async testError(type, options) {
      return entityApi.testError(type, options);
    },

    getSourceInfo() {
      return {
        type: 'http',
        name: 'HTTP API Gateway',
        capabilities: {
          offline: false,
          realtime: true,
          persistence: true,
        },
      };
    },
  };
};
```

Create the localStorage gateway:

```typescript
// repositories/[module-name]/gateways/local-storage-gateway/local-storage-gateway.ts
import type { EntityGateway } from '../[module-name].gateway.types';
import { getEntitiesFromStorage, saveEntitiesToStorage } from './helpers';
import { generateId } from '../../helpers/id-generator/id-generator.helper';
import { filterEntities } from '../../helpers/filter-entities/filter-entities.helper';
import { validateEntityData } from '../../helpers/validation/validation.helper';

export const createLocalStorageEntityGateway = (): EntityGateway => {
  return {
    async findAll(filters) {
      const entities = await getEntitiesFromStorage();
      return filters ? filterEntities(entities, filters) : entities;
    },

    async findById(id) {
      const entities = await getEntitiesFromStorage();
      const entity = entities.find((e) => e.id === id);

      if (!entity) {
        throw new Error(`Entity with id ${id} not found`);
      }

      return entity;
    },

    async create(entityData) {
      validateEntityData(entityData);

      const entities = await getEntitiesFromStorage();

      const newEntity = {
        ...entityData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedEntities = [...entities, newEntity];
      await saveEntitiesToStorage(updatedEntities);

      return newEntity;
    },

    async update(id, updates) {
      if (updates.name !== undefined) {
        validateEntityData({ name: updates.name });
      }

      const entities = await getEntitiesFromStorage();
      const entityIndex = entities.findIndex((e) => e.id === id);

      if (entityIndex === -1) {
        throw new Error(`Entity with id ${id} not found`);
      }

      const updatedEntity = {
        ...entities[entityIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      entities[entityIndex] = updatedEntity;
      await saveEntitiesToStorage(entities);

      return updatedEntity;
    },

    async delete(id) {
      const entities = await getEntitiesFromStorage();
      const filteredEntities = entities.filter((e) => e.id !== id);

      if (filteredEntities.length === entities.length) {
        throw new Error(`Entity with id ${id} not found`);
      }

      await saveEntitiesToStorage(filteredEntities);
    },

    async testError(type) {
      throw new Error(`Mock error: ${type}`);
    },

    getSourceInfo() {
      return {
        type: 'localStorage',
        name: 'Local Storage Gateway',
        capabilities: {
          offline: true,
          realtime: false,
          persistence: true,
        },
      };
    },
  };
};
```

Create the gateway factory:

```typescript
// repositories/[module-name]/gateways/index.ts
import type { DataSource } from '@/shared/gateways/base-gateway.types';
import { createHttpEntityGateway } from './http-gateway/http-gateway';
import { createLocalStorageEntityGateway } from './local-storage-gateway/local-storage-gateway';

export const createEntityGateway = (dataSource: DataSource = 'http') => {
  switch (dataSource) {
    case 'http':
      return createHttpEntityGateway();
    case 'localStorage':
      return createLocalStorageEntityGateway();
    default:
      throw new Error(`Unsupported data source: ${dataSource}`);
  }
};

export { createHttpEntityGateway } from './http-gateway/http-gateway';
export { createLocalStorageEntityGateway } from './local-storage-gateway/local-storage-gateway';
```

### Step 6: Create Repository Layer

Define repository types:

```typescript
// repositories/[module-name]/[module-name].repository.types.ts
import { type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import type { BaseRepository, PrefetchOptions } from '@/lib/react-query';
import { MutationOptions, QueryOptions } from '@/lib/react-query';
import type { DataSource } from '@/shared/gateways/base-gateway.types';
import type {
  Entity,
  EntityFilters,
  CreateEntityRequest,
  UpdateEntityRequest,
  ErrorType,
} from '../../[module-name].types';

// Repository Object Interface for Queries
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

// Repository Object Interface for Mutations
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

// Combined repository object interface
export interface EntityRepository {
  queries: EntityQueriesRepository;
  mutations: EntityMutationsRepository;
  queryKeys: typeof import('./[module-name].repository.keys').entityQueryKeys;
  queryOptions: typeof import('./[module-name].query-options').entityQueryOptions;
  mutationOptions: typeof import('./[module-name].query-options').entityMutationOptions;
}
```

Create query options:

```typescript
// repositories/[module-name]/[module-name].query-options.ts
import { createPrefetchableQuery } from '@/lib/react-query';
import { createEntityGateway } from './gateways';
import type { DataSource } from '@/shared/gateways/base-gateway.types';
import type { EntityFilters, CreateEntityRequest, UpdateEntityRequest, ErrorType } from '../../[module-name].types';

// Query Options Factory Functions
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

// Mutation Options Factory Functions
const getCreateEntityMutationOptions = (dataSource: DataSource = 'http') => ({
  mutationFn: async (entity: CreateEntityRequest) => {
    const gateway = createEntityGateway(dataSource);
    return gateway.create(entity);
  },
});

const getUpdateEntityMutationOptions = (dataSource: DataSource = 'http') => ({
  mutationFn: async ({ id, data }: { id: string | number; data: UpdateEntityRequest }) => {
    const gateway = createEntityGateway(dataSource);
    return gateway.update(id, data);
  },
});

const getDeleteEntityMutationOptions = (dataSource: DataSource = 'http') => ({
  mutationFn: async (id: string | number) => {
    const gateway = createEntityGateway(dataSource);
    return gateway.delete(id);
  },
});

// Export query options with prefetch capabilities
export const entityQueryOptions = {
  entities: createPrefetchableQuery(getEntitiesQueryOptions),
  entity: createPrefetchableQuery(getEntityQueryOptions),
} as const;

// Export mutation options
export const entityMutationOptions = {
  create: getCreateEntityMutationOptions,
  update: getUpdateEntityMutationOptions,
  delete: getDeleteEntityMutationOptions,
} as const;
```

Create query keys:

```typescript
// repositories/[module-name]/[module-name].repository.keys.ts
export const entityQueryKeys = {
  all: ['entities'] as const,
  lists: () => [...entityQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...entityQueryKeys.lists(), { filters }] as const,
  details: () => [...entityQueryKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...entityQueryKeys.details(), id] as const,
};
```

Implement queries repository:

```typescript
// repositories/[module-name]/[module-name].repository.queries.ts
import { useQuery } from '@tanstack/react-query';
import { createCancellationHelpers, createPrefetchHelpers } from '@/lib/react-query';
import { entityQueryOptions } from './[module-name].query-options';
import type { EntityQueriesRepository } from './[module-name].repository.types';

const createEntityQueriesRepository = (): EntityQueriesRepository => {
  // Prefetch helpers
  const prefetchHelpers = createPrefetchHelpers({
    prefetchEntities: entityQueryOptions.entities,
  });

  // Cancellation helpers
  const cancellationHelpers = createCancellationHelpers({
    cancelEntities: (filters?: any) => ['entities', { filters }],
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

export { createEntityQueriesRepository };
```

Implement mutations repository:

```typescript
// repositories/[module-name]/[module-name].repository.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { entityMutationOptions } from './[module-name].query-options';
import type { EntityMutationsRepository } from './[module-name].repository.types';

const createEntityMutationsRepository = (): EntityMutationsRepository => ({
  useCreateEntity: (dataSource = 'http', options) => {
    const queryClient = useQueryClient();
    const mutationOptions = entityMutationOptions.create(dataSource);

    return useMutation({
      ...mutationOptions,
      ...options,
      onSuccess: (data, variables, context) => {
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
        queryClient.setQueryData(['entities', variables.id], data);
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
        queryClient.removeQueries({ queryKey: ['entities', variables] });
        queryClient.invalidateQueries({ queryKey: ['entities'], exact: false });
        options?.onSuccess?.(data, variables, context);
      },
    });
  },
});

export { createEntityMutationsRepository };
```

Create repository index:

```typescript
// repositories/[module-name]/index.ts
import { createEntityQueriesRepository } from './[module-name].repository.queries';
import { createEntityMutationsRepository } from './[module-name].repository.mutations';
import { entityQueryKeys } from './[module-name].repository.keys';
import { entityQueryOptions, entityMutationOptions } from './[module-name].query-options';
import type { EntityRepository } from './[module-name].repository.types';

export const entityRepository: EntityRepository = {
  queries: createEntityQueriesRepository(),
  mutations: createEntityMutationsRepository(),
  queryKeys: entityQueryKeys,
  queryOptions: entityQueryOptions,
  mutationOptions: entityMutationOptions,
};

export type { EntityRepository } from './[module-name].repository.types';
export { createEntityGateway } from './gateways';
```

### Step 7: Create Selectors

Create a basic selector:

```typescript
// selectors/use-[selector-name]-selector/use-[selector-name]-selector.hook.ts
import { useMemo } from 'react';
import { entityRepository } from '@/modules/[module-name]/repositories/[module-name]';
import type { DataSource } from '@/shared/gateways/base-gateway.types';

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

Create selector index:

```typescript
// selectors/index.ts
export { useCompletedEntitiesSelector } from './use-completed-entities-selector/use-completed-entities-selector.hook';
// Add other selectors here
```

### Step 8: Create Zustand Store

Create store types:

```typescript
// stores/[module-name].store.types.ts
import type { Entity, EntityFilters } from '../[module-name].types';

export interface EntityState {
  selectedEntityId: string | number | null;
  filters: EntityFilters;
}

export interface EntityActions {
  setSelectedEntity: (entity: Entity | null) => void;
  setFilters: (filters: EntityFilters) => void;
  clearFilters: () => void;
}

export interface EntityStore extends EntityState {
  actions: EntityActions;
}
```

Implement the store:

```typescript
// stores/[module-name].store.ts
import { createStoreWithMiddleware } from '@/lib/zustand';
import type { EntityStore, EntityState, EntityActions } from './[module-name].store.types';

const initialState: EntityState = {
  selectedEntityId: null,
  filters: {},
};

export const useEntityStore = createStoreWithMiddleware<EntityStore>(
  (set) => ({
    ...initialState,

    actions: {
      setSelectedEntity: (entity) =>
        set((state) => {
          state.selectedEntityId = entity?.id || null;
        }),

      setFilters: (filters) =>
        set((state) => {
          state.filters = filters;
        }),

      clearFilters: () =>
        set((state) => {
          state.filters = {};
        }),
    },
  }),
  'entity-store',
  {
    persist: true,
    exclude: ['actions'],
  },
);

// Convenient action hooks
export const useEntityActions = () => useEntityStore((state) => state.actions);
```

### Step 9: Create View Hooks

Create business hook:

```typescript
// views/[view-name]/hooks/use-[view-name]-business/use-[view-name]-business.hook.ts
import { useCallback, useMemo } from 'react';
import { entityRepository } from '@/modules/[module-name]/repositories/[module-name]';
import { createEntityGateway } from '@/modules/[module-name]/repositories/[module-name]/gateways';
import { useEntityActions } from '@/modules/[module-name]/stores/[module-name].store';
import type {
  CreateEntityRequest,
  UpdateEntityRequest,
  EntityFilters,
} from '@/modules/[module-name]/[module-name].types';
import type { DataSource } from '@/shared/gateways/base-gateway.types';

export const useEntityManagementBusiness = (dataSource: DataSource = 'http') => {
  const { setSelectedEntity, setFilters } = useEntityActions();

  // Data fetching
  const entitiesQuery = entityRepository.queries.useEntities(undefined, dataSource);

  // Mutations
  const createMutation = entityRepository.mutations.useCreateEntity(dataSource);
  const updateMutation = entityRepository.mutations.useUpdateEntity(dataSource);
  const deleteMutation = entityRepository.mutations.useDeleteEntity(dataSource);

  // Business actions
  const createEntity = useCallback(
    async (data: CreateEntityRequest) => {
      if (!data.name?.trim()) {
        throw new Error('Entity name is required');
      }

      const entityData = {
        ...data,
        name: data.name.trim(),
        createdAt: new Date().toISOString(),
        status: data.status || 'pending',
      };

      return createMutation.mutate(entityData);
    },
    [createMutation],
  );

  const updateEntity = useCallback(
    (id: string | number, data: UpdateEntityRequest) => {
      return updateMutation.mutate({ id, data });
    },
    [updateMutation],
  );

  const deleteEntity = useCallback(
    (id: string | number) => {
      return deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const applyFilters = useCallback(
    (newFilters: Partial<EntityFilters>) => {
      setFilters(newFilters);
    },
    [setFilters],
  );

  // Presentation data
  const formattedEntities = useMemo(() => {
    if (!entitiesQuery.data) return [];

    return entitiesQuery.data.map((entity) => ({
      ...entity,
      displayName: entity.name.length > 50 ? `${entity.name.slice(0, 50)}...` : entity.name,
    }));
  }, [entitiesQuery.data]);

  // Gateway info
  const getSourceInfo = useCallback(() => {
    const gateway = createEntityGateway(dataSource);
    return gateway.getSourceInfo();
  }, [dataSource]);

  const isEmpty = !entitiesQuery.isLoading && (!entitiesQuery.data || entitiesQuery.data.length === 0);
  const isLoading = entitiesQuery.isLoading;
  const hasError = !!(entitiesQuery.error || createMutation.error || updateMutation.error || deleteMutation.error);

  return {
    // Business actions
    createEntity,
    updateEntity,
    deleteEntity,
    applyFilters,
    setSelectedEntity,

    // Data
    entities: formattedEntities,

    // States
    isEmpty,
    isLoading,
    hasError,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error: entitiesQuery.error || createMutation.error || updateMutation.error || deleteMutation.error,

    // Utilities
    refetch: entitiesQuery.refetch,
    getSourceInfo,
  };
};
```

Create controller hook:

```typescript
// views/[view-name]/hooks/use-[view-name]-controller/use-[view-name]-controller.hook.ts
import { useCallback, useState } from 'react';
import type {
  CreateEntityRequest,
  UpdateEntityRequest,
  EntityFilters,
} from '@/modules/[module-name]/[module-name].types';
import { useShowDialog } from '@/ui/dialog/hooks';

export const useEntityManagementController = () => {
  // UI state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // UI patterns
  const { showDialog } = useShowDialog();

  // UI handlers
  const handleCreateClick = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  const handleCreateCancel = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  const handleCreateSubmit = useCallback(
    (createEntityFn: (data: CreateEntityRequest) => Promise<void>) => async (entityData: CreateEntityRequest) => {
      await createEntityFn(entityData);
      setShowCreateForm(false);
    },
    [],
  );

  const handleDeleteClick = useCallback(
    (deleteEntityFn: (id: string | number) => void) => (entity: any) => {
      showDialog({
        title: 'Delete Entity',
        message: `Are you sure you want to delete "${entity.name}"?`,
        severity: 'WARNING',
        acceptText: 'Delete',
        cancelText: 'Cancel',
        handleAccept: () => deleteEntityFn(entity.id),
      });
    },
    [showDialog],
  );

  const handleFilterChange = useCallback(
    (applyFiltersFn: (filters: Partial<EntityFilters>) => void) => (newFilters: Partial<EntityFilters>) => {
      applyFiltersFn(newFilters);
    },
    [],
  );

  return {
    // UI handlers
    handleCreateClick,
    handleCreateCancel,
    handleCreateSubmit,
    handleDeleteClick,
    handleFilterChange,

    // UI state
    showCreateForm,
    editingEntity,
    searchTerm,
    isEditing: editingEntity !== null,
  };
};
```

### Step 10: Create View Component

Create the main view:

```typescript
// views/[view-name]/[view-name].view.tsx
import { useState } from 'react';
import type { DataSource } from '@/shared/gateways/base-gateway.types';
import { useEntityManagementBusiness } from './hooks/use-entity-management-business/use-entity-management-business.hook';
import { useEntityManagementController } from './hooks/use-entity-management-controller/use-entity-management-controller.hook';

export const EntityManagementView = () => {
  const [dataSource, setDataSource] = useState<DataSource>('http');

  // Business logic
  const business = useEntityManagementBusiness(dataSource);

  // UI control
  const controller = useEntityManagementController();

  // Connect business and controller
  const handleCreate = controller.handleCreateSubmit(business.createEntity);
  const handleDelete = controller.handleDeleteClick(business.deleteEntity);
  const handleFilterChange = controller.handleFilterChange(business.applyFilters);

  if (business.isLoading) {
    return <div>Loading...</div>;
  }

  if (business.hasError) {
    return <div>Error: {business.error?.message}</div>;
  }

  return (
    <div>
      <h1>Entity Management</h1>

      <button onClick={controller.handleCreateClick}>
        Create New Entity
      </button>

      <div>
        {business.entities.map((entity) => (
          <div key={entity.id}>
            <span>{entity.displayName}</span>
            <button onClick={() => handleDelete(entity)}>Delete</button>
          </div>
        ))}
      </div>

      {controller.showCreateForm && (
        <div>
          {/* Create form component */}
        </div>
      )}
    </div>
  );
};
```

### Step 11: Update Module Index

Export all public APIs:

```typescript
// index.ts
// Types
export type { Entity, CreateEntityRequest, UpdateEntityRequest, EntityFilters } from './[module-name].types';

// Repository
export { entityRepository } from './repositories/[module-name]';
export type { EntityRepository } from './repositories/[module-name]';

// Selectors
export * from './selectors';

// Store
export { useEntityStore, useEntityActions } from './stores/[module-name].store';

// Views
export { EntityManagementView } from './views/entity-management/entity-management.view';

// Components
export * from './components';

// Hooks
export * from './hooks';
```

## Adding New Features to Existing Modules

### Adding New Endpoints

1. **Update Types**: Add new request/response types
2. **Update API**: Add new methods to the API service
3. **Update Gateway Interface**: Add new methods to gateway contract
4. **Update Gateway Implementations**: Implement new methods in all gateways
5. **Update Repository**: Add new query/mutation options and repository methods
6. **Update Tests**: Add tests for new functionality

### Adding New Gateways

1. **Create Gateway Directory**: `gateways/[new-gateway]/`
2. **Implement Gateway Interface**: Follow the established contract
3. **Add Helper Functions**: Create any gateway-specific utilities
4. **Update Gateway Factory**: Add new case to createGateway function
5. **Add Tests**: Test the new gateway implementation

### Adding New Selectors

1. **Create Selector Directory**: `selectors/use-[name]-selector/`
2. **Implement Selector Hook**: Follow the established patterns
3. **Add to Selector Index**: Export from selectors/index.ts
4. **Add Tests**: Test the selector logic
5. **Update Documentation**: Document the new selector

## Testing Guide

### Unit Testing Approach

```typescript
// Example test structure
describe('[Module] [Component/Hook]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('business logic', () => {
    // Test business logic independently
  });

  describe('UI interactions', () => {
    // Test UI behavior
  });

  describe('integration', () => {
    // Test business + UI integration
  });
});
```

### Mock Strategies

- **Repository Mocking**: Mock the entire repository for component tests
- **Gateway Mocking**: Use mock gateways for integration tests
- **Selector Mocking**: Mock selectors for isolated component tests

## Best Practices Summary

1. **Follow Naming Conventions**: Use consistent kebab-case for files, camelCase for variables
2. **Maintain Type Safety**: Define proper TypeScript interfaces for all layers
3. **Separate Concerns**: Keep business logic and UI logic in separate hooks
4. **Test Thoroughly**: Write tests for each layer independently
5. **Document Changes**: Update documentation when adding new patterns
6. **Use Established Patterns**: Follow the existing architectural patterns
7. **Handle Errors Properly**: Implement proper error handling at each layer
8. **Performance Considerations**: Use proper memoization and optimization techniques

## Common Pitfalls

1. **Mixing Business and UI Logic**: Keep them separated in different hooks
2. **Direct Gateway Usage**: Always use repositories, not gateways directly
3. **Missing Error Handling**: Handle errors at appropriate layers
4. **Inconsistent Patterns**: Follow established conventions across modules
5. **Poor Test Coverage**: Test each layer independently with proper mocks

This guide should enable developers to create new modules and extend existing functionality following the established architectural patterns.
