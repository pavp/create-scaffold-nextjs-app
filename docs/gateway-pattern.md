# Gateway Pattern

The Gateway Pattern provides an abstraction layer between the application logic and external data sources, enabling seamless switching between different data providers (HTTP APIs, localStorage, mock data, etc.).

## Purpose

- **Data Source Abstraction**: Hide implementation details of different data sources
- **Flexibility**: Switch between data sources without changing business logic
- **Consistency**: Provide uniform interface regardless of underlying storage mechanism
- **Testing**: Enable easy mocking and testing with different data sources

## Structure

```typescript
// Base gateway interface - shared across all gateways
export interface BaseGateway {
  getSourceInfo(): {
    type: DataSource;
    name: string;
    capabilities: {
      offline: boolean;
      realtime: boolean;
      persistence: boolean;
    };
  };
}

// Gateway options for additional parameters like cancellation
export interface GatewayOptions {
  signal?: AbortSignal;
}

// Feature-specific gateway interface
export interface EntityGateway extends BaseGateway {
  findAll(filters?: EntityFilters, options?: GatewayOptions): Promise<Entity[]>;
  findById(id: string | number, options?: GatewayOptions): Promise<Entity>;
  create(entity: CreateEntityRequest, options?: GatewayOptions): Promise<Entity>;
  update(id: string | number, entity: UpdateEntityRequest, options?: GatewayOptions): Promise<Entity>;
  delete(id: string | number, options?: GatewayOptions): Promise<void>;
}

// Data source types
export type DataSource = 'http' | 'localStorage' | 'mock' | 'indexedDB';
```

## Implementation Examples

### 1. HTTP Gateway

```typescript
// gateways/http-gateway/http-gateway.ts
import { entityApi } from '@/modules/entity/api/entity-api';
import { validateEntityData } from '../../helpers/validation/validation.helper';
import type { EntityGateway } from '../entity.gateway.types';

export const createHttpEntityGateway = (): EntityGateway => {
  return {
    async findAll(filters, options) {
      return entityApi.getAll(filters, options);
    },

    async findById(id, options) {
      return entityApi.getById(id, options);
    },

    async create(entity, options) {
      // Gateway-level validation
      validateEntityData(entity);

      return entityApi.create(entity, options);
    },

    async update(id, entity, options) {
      // Validate only provided fields
      if (entity.name !== undefined) {
        validateEntityData({ name: entity.name });
      }

      return entityApi.update(id, entity, options);
    },

    async delete(id, options) {
      await entityApi.delete(id, options);
    },

    getSourceInfo() {
      return {
        type: 'http',
        name: 'HTTP API Gateway',
        capabilities: {
          offline: false,
          realtime: true,
          persistence: true, // Server-side persistence
        },
      };
    },
  };
};
```

### 2. LocalStorage Gateway

```typescript
// gateways/local-storage-gateway/local-storage-gateway.ts
import type { EntityGateway } from '../entity.gateway.types';
import { getEntitiesFromStorage, saveEntitiesToStorage } from './helpers';
import { generateId } from '../../helpers/id-generator/id-generator.helper';
import { filterEntities } from '../../helpers/filter-entities/filter-entities.helper';

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
      const entities = await getEntitiesFromStorage();

      const newEntity: Entity = {
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

    getSourceInfo() {
      return {
        type: 'localStorage',
        name: 'Local Storage Gateway',
        capabilities: {
          offline: true,
          realtime: false,
          persistence: true, // Browser persistence
        },
      };
    },
  };
};
```

### 3. Mock Gateway (for testing/development)

```typescript
// gateways/mock-gateway/mock-gateway.ts
import type { EntityGateway } from '../entity.gateway.types';
import { generateMockEntities } from './helpers/generate-mock-entities';

export const createMockEntityGateway = (): EntityGateway => {
  let mockEntities = generateMockEntities(10);

  return {
    async findAll(filters) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      return filters
        ? mockEntities.filter((entity) => {
            return (
              (!filters.status || entity.status === filters.status) &&
              (!filters.search || entity.name.toLowerCase().includes(filters.search.toLowerCase()))
            );
          })
        : mockEntities;
    },

    async findById(id) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const entity = mockEntities.find((e) => e.id === id);
      if (!entity) {
        throw new Error(`Entity with id ${id} not found`);
      }

      return entity;
    },

    async create(entityData) {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const newEntity = {
        ...entityData,
        id: Math.max(...mockEntities.map((e) => Number(e.id)), 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockEntities = [...mockEntities, newEntity];
      return newEntity;
    },

    async update(id, updates) {
      await new Promise((resolve) => setTimeout(resolve, 350));

      const index = mockEntities.findIndex((e) => e.id === id);
      if (index === -1) {
        throw new Error(`Entity with id ${id} not found`);
      }

      const updatedEntity = {
        ...mockEntities[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      mockEntities[index] = updatedEntity;
      return updatedEntity;
    },

    async delete(id) {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const initialLength = mockEntities.length;
      mockEntities = mockEntities.filter((e) => e.id !== id);

      if (mockEntities.length === initialLength) {
        throw new Error(`Entity with id ${id} not found`);
      }
    },

    getSourceInfo() {
      return {
        type: 'mock',
        name: 'Mock Data Gateway',
        capabilities: {
          offline: true,
          realtime: false,
          persistence: false, // In-memory only
        },
      };
    },
  };
};
```

## Gateway Factory

```typescript
// gateways/index.ts
import type { DataSource } from '@/shared/gateways/base-gateway.types';
import { createHttpEntityGateway } from './http-gateway/http-gateway';
import { createLocalStorageEntityGateway } from './local-storage-gateway/local-storage-gateway';
import { createMockEntityGateway } from './mock-gateway/mock-gateway';

export const createEntityGateway = (dataSource: DataSource = 'http') => {
  switch (dataSource) {
    case 'http':
      return createHttpEntityGateway();
    case 'localStorage':
      return createLocalStorageEntityGateway();
    case 'mock':
      return createMockEntityGateway();
    default:
      throw new Error(`Unsupported data source: ${dataSource}`);
  }
};

// Export individual gateways for testing
export { createHttpEntityGateway } from './http-gateway/http-gateway';
export { createLocalStorageEntityGateway } from './local-storage-gateway/local-storage-gateway';
export { createMockEntityGateway } from './mock-gateway/mock-gateway';
```

## Helper Functions

### Storage Helpers (LocalStorage)

```typescript
// gateways/local-storage-gateway/helpers/get-entities-from-storage.ts
const STORAGE_KEY = 'entities';

export const getEntitiesFromStorage = async (): Promise<Entity[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load entities from storage:', error);
    return [];
  }
};

// gateways/local-storage-gateway/helpers/save-entities-to-storage.ts
export const saveEntitiesToStorage = async (entities: Entity[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entities));
  } catch (error) {
    console.error('Failed to save entities to storage:', error);
    throw new Error('Storage operation failed');
  }
};
```

### Filter Helpers

```typescript
// helpers/filter-entities/filter-entities.helper.ts
export const filterEntities = (entities: Entity[], filters: EntityFilters): Entity[] => {
  return entities.filter((entity) => {
    // Status filter
    if (filters.status && entity.status !== filters.status) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return entity.name.toLowerCase().includes(searchTerm) || entity.description?.toLowerCase().includes(searchTerm);
    }

    // Date range filter
    if (filters.dateFrom && new Date(entity.createdAt) < new Date(filters.dateFrom)) {
      return false;
    }

    if (filters.dateTo && new Date(entity.createdAt) > new Date(filters.dateTo)) {
      return false;
    }

    return true;
  });
};
```

## Usage in Repository

```typescript
// In repository implementation
const getEntitiesQueryOptions = (filters?: EntityFilters, dataSource: DataSource = 'http') => ({
  queryKey: ['entities', { filters, dataSource }],
  queryFn: async ({ signal }: { signal?: AbortSignal }) => {
    // Gateway abstraction - business logic doesn't care about the source
    const gateway = createEntityGateway(dataSource);
    return gateway.findAll(filters, { signal });
  },
});
```

## Benefits

### ✅ Advantages

1. **Data Source Flexibility**: Easy to switch between HTTP API, localStorage, mock data, etc.
2. **Consistent Interface**: All gateways implement the same interface
3. **Testing**: Use mock gateways for unit tests, localStorage for integration tests
4. **Offline Support**: LocalStorage gateway enables offline functionality
5. **Development**: Mock gateway provides instant feedback during development
6. **Migration**: Easy to migrate between different storage solutions
7. **Feature Flags**: Switch data sources based on configuration or user preferences

### ⚠️ Trade-offs

1. **Abstraction Overhead**: Additional layer between business logic and data
2. **Implementation Complexity**: Need to implement multiple gateways
3. **Feature Parity**: Different gateways may have different capabilities
4. **Debugging**: Additional abstraction layer can make debugging harder

## Best Practices

### 1. Consistent Error Handling

```typescript
// ✅ Good - consistent error format across gateways
export class EntityNotFoundError extends Error {
  constructor(id: string | number) {
    super(`Entity with id ${id} not found`);
    this.name = 'EntityNotFoundError';
  }
}

export class EntityValidationError extends Error {
  constructor(message: string) {
    super(`Validation error: ${message}`);
    this.name = 'EntityValidationError';
  }
}
```

### 2. Gateway-Specific Optimizations

```typescript
// ✅ Good - optimize per gateway capability
const createOptimizedEntityGateway = (dataSource: DataSource) => {
  const baseGateway = createEntityGateway(dataSource);

  // Add caching for slow data sources
  if (dataSource === 'http') {
    return addHttpCaching(baseGateway);
  }

  // Add indexing for large localStorage datasets
  if (dataSource === 'localStorage') {
    return addLocalStorageIndexing(baseGateway);
  }

  return baseGateway;
};
```

### 3. Capability-Based Features

```typescript
// ✅ Good - use gateway capabilities to enable/disable features
export const useEntityFeatures = (dataSource: DataSource) => {
  const gateway = createEntityGateway(dataSource);
  const capabilities = gateway.getSourceInfo().capabilities;

  return {
    canWorkOffline: capabilities.offline,
    hasRealTimeUpdates: capabilities.realtime,
    isPersistent: capabilities.persistence,
    showOfflineIndicator: !capabilities.realtime,
  };
};
```

### 4. Data Transformation

```typescript
// ✅ Good - handle data format differences in gateways
export const createHttpEntityGateway = (): EntityGateway => ({
  async findAll(filters, options) {
    const response = await entityApi.getAll(filters, options);

    // Transform API response to internal format
    return response.map((apiEntity) => ({
      ...apiEntity,
      // Convert API date format to ISO
      createdAt: new Date(apiEntity.created_at).toISOString(),
      updatedAt: new Date(apiEntity.updated_at).toISOString(),
    }));
  },

  async create(entity, options) {
    // Transform internal format to API format
    const apiEntity = {
      ...entity,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };

    const response = await entityApi.create(apiEntity, options);

    // Transform response back to internal format
    return {
      ...response,
      createdAt: new Date(response.created_at).toISOString(),
      updatedAt: new Date(response.updated_at).toISOString(),
    };
  },
});
```

## Testing Strategies

### 1. Gateway Interface Testing

```typescript
// Test that all gateways implement the interface correctly
const testGatewayInterface = (gateway: EntityGateway) => {
  test('should implement all required methods', () => {
    expect(typeof gateway.findAll).toBe('function');
    expect(typeof gateway.findById).toBe('function');
    expect(typeof gateway.create).toBe('function');
    expect(typeof gateway.update).toBe('function');
    expect(typeof gateway.delete).toBe('function');
    expect(typeof gateway.getSourceInfo).toBe('function');
  });
};

// Run tests for all gateways
describe('HTTP Gateway', () => testGatewayInterface(createHttpEntityGateway()));
describe('LocalStorage Gateway', () => testGatewayInterface(createLocalStorageEntityGateway()));
describe('Mock Gateway', () => testGatewayInterface(createMockEntityGateway()));
```

### 2. Business Logic Testing with Mock Gateway

```typescript
// Use mock gateway for predictable testing
test('should handle entity creation workflow', async () => {
  const mockGateway = createMockEntityGateway();

  // Test create
  const newEntity = await mockGateway.create({
    name: 'Test Entity',
    status: 'active',
  });

  expect(newEntity.name).toBe('Test Entity');
  expect(newEntity.id).toBeDefined();

  // Test find by id
  const foundEntity = await mockGateway.findById(newEntity.id);
  expect(foundEntity).toEqual(newEntity);

  // Test update
  const updatedEntity = await mockGateway.update(newEntity.id, {
    status: 'inactive',
  });

  expect(updatedEntity.status).toBe('inactive');
  expect(updatedEntity.name).toBe('Test Entity'); // Unchanged
});
```

## Related Patterns

- [Repository Pattern](./repository-pattern.md) - Higher-level data access abstraction
- [API Pattern](./api-pattern.md) - HTTP client integration
- [Hook Patterns](./hook-patterns.md) - Using gateways in business logic
