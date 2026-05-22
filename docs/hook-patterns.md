# Hook Patterns

This document explains the hook patterns used to separate concerns between business logic and UI control logic, creating maintainable and testable React applications.

## Overview

The application uses **two distinct hook types** to separate concerns:

- **Business Hooks**: Handle data fetching, business rules, and application logic
- **Controller Hooks**: Manage UI state, user interactions, and presentation logic

This separation enables independent testing, reusability, and cleaner component code.

## Business Hooks

Business hooks encapsulate application logic, data transformations, and business rules. They interact with repositories, selectors, and stores but remain UI-agnostic.

### Structure

```typescript
// Business hook naming pattern
export const use[Feature]Business = (params) => {
  // Data fetching via repositories and selectors
  // Business logic and transformations
  // Return business data and actions
};
```

### Implementation Example

```typescript
// hooks/use-entity-management-business/use-entity-management-business.hook.ts
export const useEntityManagementBusiness = (dataSource: DataSource = 'http') => {
  // 1. Data fetching via selectors and repository
  const { filters } = useFiltersSelector();
  const { selectedEntity } = useSelectedEntitySelector();
  const { setSelectedEntity, setFilters } = useEntityActions();

  // Repository queries and mutations
  const entitiesQuery = entityRepository.queries.useEntities(filters, dataSource);
  const entityStatsQuery = useEntityStatsSelector(dataSource);
  const createMutation = entityRepository.mutations.useCreateEntity(dataSource);
  const updateMutation = entityRepository.mutations.useUpdateEntity(dataSource);
  const deleteMutation = entityRepository.mutations.useDeleteEntity(dataSource);

  // 2. Business actions with validation and rules
  const createEntity = useCallback(
    async (data: CreateEntityRequest) => {
      // Business validation
      if (!data.name?.trim()) {
        throw new Error('Entity name is required');
      }

      if (data.name.length > 100) {
        throw new Error('Entity name must be less than 100 characters');
      }

      // Business logic - data transformation
      const entityData = {
        ...data,
        name: data.name.trim(),
        createdAt: new Date().toISOString(),
        status: data.status || 'pending',
        priority: data.priority || 'medium',
      };

      return createMutation.mutate(entityData);
    },
    [createMutation],
  );

  const updateEntity = useCallback(
    (id: string | number, data: UpdateEntityRequest) => {
      // Business rule: can't change status of completed entities
      if (selectedEntity?.status === 'completed' && data.status && data.status !== 'completed') {
        throw new Error('Cannot change status of completed entities');
      }

      return updateMutation.mutate({ id, data });
    },
    [updateMutation, selectedEntity],
  );

  const deleteEntity = useCallback(
    (id: string | number) => {
      // Business rule: can't delete entities with dependencies
      const entity = entitiesQuery.data?.find((e) => e.id === id);
      if (entity?.hasChildEntities) {
        throw new Error('Cannot delete entities with child entities');
      }

      return deleteMutation.mutate(id);
    },
    [deleteMutation, entitiesQuery.data],
  );

  const applyFilters = useCallback(
    (newFilters: Partial<EntityFilters>) => {
      setFilters({ ...filters, ...newFilters });
    },
    [filters, setFilters],
  );

  // 3. Presentation data - formatted for display
  const formattedEntities = useMemo(() => {
    if (!entitiesQuery.data) return [];

    return entitiesQuery.data.map((entity) => ({
      ...entity,
      displayName: entity.name.length > 50 ? `${entity.name.slice(0, 50)}...` : entity.name,
      priorityColor: getPriorityColor(entity.priority),
      statusIcon: getStatusIcon(entity.status),
      dueDisplay: entity.dueDate ? formatRelativeDate(entity.dueDate) : null,
      isOverdue: entity.dueDate ? new Date(entity.dueDate) < new Date() : false,
    }));
  }, [entitiesQuery.data]);

  const summary = useMemo(() => {
    if (!entitiesQuery.data || !entityStatsQuery.data) return null;

    return {
      total: entitiesQuery.data.length,
      completed: entityStatsQuery.data.completed,
      pending: entityStatsQuery.data.pending,
      completionRate: entityStatsQuery.data.completionRate,
      motivationalMessage: getMotivationalMessage(entitiesQuery.data),
    };
  }, [entitiesQuery.data, entityStatsQuery.data]);

  // 4. Gateway information
  const getSourceInfo = useCallback(() => {
    const gateway = createEntityGateway(dataSource);
    return gateway.getSourceInfo();
  }, [dataSource]);

  // 5. Computed states
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

    // Presentation data
    entities: formattedEntities,
    summary,
    selectedEntity,
    filters,

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

## Controller Hooks

Controller hooks manage UI state, user interactions, and presentation logic. They receive business logic functions as parameters to maintain separation of concerns.

### Structure

```typescript
// Controller hook naming pattern
export const use[Feature]Controller = () => {
  // UI-only state
  // UI interaction handlers
  // Return UI state and handlers
};
```

### Implementation Example

```typescript
// hooks/use-entity-management-controller/use-entity-management-controller.hook.ts
export const useEntityManagementController = () => {
  // 1. UI-only state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState<'list' | 'grid' | 'table'>('list');

  // 2. UI patterns and dialogs
  const { showDialog } = useShowDialog();
  const { showToast } = useShowToast();

  // 3. UI interaction handlers - receive business logic as parameters
  const handleCreateClick = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  const handleCreateCancel = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  const handleCreateSubmit = useCallback(
    (createEntityFn: (data: CreateEntityRequest) => Promise<void>) => async (entityData: CreateEntityRequest) => {
      try {
        await createEntityFn(entityData);
        setShowCreateForm(false);
        showToast('Entity created successfully', 'success');
      } catch (error) {
        showToast(`Failed to create entity: ${error.message}`, 'error');
      }
    },
    [showToast],
  );

  const handleEditClick = useCallback(
    (entityId: string | number, setSelectedEntityFn: (entity: any) => void, entities: any[]) => {
      setEditingEntity(entityId);
      const entity = entities.find((e) => e.id === entityId);

      if (entity) {
        setSelectedEntityFn(entity);
      }
    },
    [],
  );

  const handleEditCancel = useCallback((setSelectedEntityFn: (entity: any) => void) => {
    setEditingEntity(null);
    setSelectedEntityFn(null);
  }, []);

  const handleEditSubmit = useCallback(
    async (params: {
      updateEntityFn: (id: string | number, data: UpdateEntityRequest) => Promise<void>;
      entityId: string | number;
      updates: UpdateEntityRequest;
      setSelectedEntityFn: (entity: any) => void;
    }) => {
      try {
        await params.updateEntityFn(params.entityId, params.updates);
        setEditingEntity(null);
        params.setSelectedEntityFn(null);
        showToast('Entity updated successfully', 'success');
      } catch (error) {
        showToast(`Failed to update entity: ${error.message}`, 'error');
      }
    },
    [showToast],
  );

  const handleDeleteClick = useCallback(
    (deleteEntityFn: (id: string | number) => void) => (entity: Entity) => {
      showDialog({
        title: 'Delete Entity',
        message: `Are you sure you want to delete "${entity.name}"?`,
        severity: 'WARNING',
        acceptText: 'Delete',
        cancelText: 'Cancel',
        handleAccept: () => {
          try {
            deleteEntityFn(entity.id);
            showToast('Entity deleted successfully', 'success');
          } catch (error) {
            showToast(`Failed to delete entity: ${error.message}`, 'error');
          }
        },
      });
    },
    [showDialog, showToast],
  );

  const handleFilterChange = useCallback(
    (applyFiltersFn: (filters: Partial<EntityFilters>) => void) => (newFilters: Partial<EntityFilters>) => {
      applyFiltersFn(newFilters);
    },
    [],
  );

  const handleSearchChange = useCallback((applyFiltersFn: (filters: Partial<EntityFilters>) => void, term: string) => {
    setSearchTerm(term);
    applyFiltersFn({ search: term });
  }, []);

  const handleViewChange = useCallback((view: 'list' | 'grid' | 'table') => {
    setSelectedView(view);
  }, []);

  const handleBulkAction = useCallback(
    (
      action: 'delete' | 'complete' | 'archive',
      selectedIds: (string | number)[],
      bulkActionFn: (action: string, ids: (string | number)[]) => Promise<void>,
    ) => {
      showDialog({
        title: `Bulk ${action.charAt(0).toUpperCase() + action.slice(1)}`,
        message: `Are you sure you want to ${action} ${selectedIds.length} entities?`,
        severity: 'WARNING',
        acceptText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelText: 'Cancel',
        handleAccept: async () => {
          try {
            await bulkActionFn(action, selectedIds);
            showToast(`Successfully ${action}d ${selectedIds.length} entities`, 'success');
          } catch (error) {
            showToast(`Failed to ${action} entities: ${error.message}`, 'error');
          }
        },
      });
    },
    [showDialog, showToast],
  );

  // 4. UI state derivations
  const isEditing = editingEntity !== null;
  const hasActiveSearch = searchTerm.trim().length > 0;

  return {
    // UI handlers (receive business logic as params)
    handleCreateClick,
    handleCreateCancel,
    handleCreateSubmit,
    handleEditClick,
    handleEditCancel,
    handleEditSubmit,
    handleDeleteClick,
    handleFilterChange,
    handleSearchChange,
    handleViewChange,
    handleBulkAction,

    // UI state
    showCreateForm,
    editingEntity,
    searchTerm,
    selectedView,
    isEditing,
    hasActiveSearch,
  };
};
```

## Combining Hooks in Views

Views combine business and controller hooks to create complete functionality:

```typescript
// views/entity-management/entity-management.view.tsx
export const EntityManagementView = () => {
  const [dataSource, setDataSource] = useState<DataSource>('http');

  // Business logic
  const business = useEntityManagementBusiness(dataSource);

  // UI control
  const controller = useEntityManagementController();

  // Connect business and controller
  const handleCreate = controller.handleCreateSubmit(business.createEntity);
  const handleEdit = controller.handleEditSubmit;
  const handleDelete = controller.handleDeleteClick(business.deleteEntity);
  const handleFilterChange = controller.handleFilterChange(business.applyFilters);
  const handleSearchChange = useMemo(
    () => (term: string) => controller.handleSearchChange(business.applyFilters, term),
    [controller.handleSearchChange, business.applyFilters]
  );

  if (business.isLoading) {
    return <EntityManagementSkeleton />;
  }

  if (business.hasError) {
    return <ErrorBoundary error={business.error} onRetry={business.refetch} />;
  }

  return (
    <div>
      <EntityHeader
        onCreateClick={controller.handleCreateClick}
        onViewChange={controller.handleViewChange}
        selectedView={controller.selectedView}
        sourceInfo={business.getSourceInfo()}
      />

      <EntityFilters
        filters={business.filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        searchTerm={controller.searchTerm}
      />

      <EntitySummary summary={business.summary} />

      <EntityList
        entities={business.entities}
        selectedView={controller.selectedView}
        onEditClick={(id) => controller.handleEditClick(id, business.setSelectedEntity, business.entities)}
        onDeleteClick={handleDelete}
        isLoading={business.isLoading}
      />

      {controller.showCreateForm && (
        <EntityCreateForm
          onSubmit={handleCreate}
          onCancel={controller.handleCreateCancel}
          isSubmitting={business.isCreating}
        />
      )}

      {controller.isEditing && business.selectedEntity && (
        <EntityEditForm
          entity={business.selectedEntity}
          onSubmit={(updates) => handleEdit({
            updateEntityFn: business.updateEntity,
            entityId: controller.editingEntity!,
            updates,
            setSelectedEntityFn: business.setSelectedEntity,
          })}
          onCancel={() => controller.handleEditCancel(business.setSelectedEntity)}
          isSubmitting={business.isUpdating}
        />
      )}
    </div>
  );
};
```

## Testing Strategies

### Testing Business Hooks

```typescript
// use-entity-management-business.hook.test.ts
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEntityManagementBusiness } from './use-entity-management-business.hook';

// Mock dependencies
jest.mock('@/modules/entity/repositories/entity');
jest.mock('@/modules/entity/selectors');
jest.mock('@/modules/entity/stores/entity.store');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useEntityManagementBusiness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create entity with validation', async () => {
    const mockMutation = { mutate: jest.fn(), isPending: false };
    mockEntityRepository.mutations.useCreateEntity.mockReturnValue(mockMutation);

    const { result } = renderHook(() => useEntityManagementBusiness(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.createEntity({
        name: '  Test Entity  ',
        status: 'pending',
      });
    });

    expect(mockMutation.mutate).toHaveBeenCalledWith({
      name: 'Test Entity', // Trimmed
      status: 'pending',
      createdAt: expect.any(String),
      priority: 'medium', // Default value
    });
  });

  it('should validate entity name', async () => {
    const { result } = renderHook(() => useEntityManagementBusiness(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.createEntity({ name: '' })
    ).rejects.toThrow('Entity name is required');
  });

  it('should format entities for display', () => {
    const mockEntities = [
      {
        id: 1,
        name: 'Very long entity name that should be truncated for display purposes',
        priority: 'high',
        status: 'pending',
      },
    ];

    mockEntityRepository.queries.useEntities.mockReturnValue({
      data: mockEntities,
      isLoading: false,
    });

    const { result } = renderHook(() => useEntityManagementBusiness(), {
      wrapper: createWrapper(),
    });

    expect(result.current.entities[0].displayName).toBe(
      'Very long entity name that should be truncated...'
    );
    expect(result.current.entities[0].priorityColor).toBeDefined();
  });
});
```

### Testing Controller Hooks

```typescript
// use-entity-management-controller.hook.test.ts
import { renderHook, act } from '@testing-library/react';
import { useEntityManagementController } from './use-entity-management-controller.hook';

// Mock UI dependencies
jest.mock('@/ui/dialog/hooks', () => ({
  useShowDialog: () => ({ showDialog: jest.fn() }),
}));

jest.mock('@/ui/toast/hooks', () => ({
  useShowToast: () => ({ showToast: jest.fn() }),
}));

describe('useEntityManagementController', () => {
  it('should manage create form state', () => {
    const { result } = renderHook(() => useEntityManagementController());

    expect(result.current.showCreateForm).toBe(false);

    act(() => {
      result.current.handleCreateClick();
    });

    expect(result.current.showCreateForm).toBe(true);

    act(() => {
      result.current.handleCreateCancel();
    });

    expect(result.current.showCreateForm).toBe(false);
  });

  it('should handle edit workflow', () => {
    const { result } = renderHook(() => useEntityManagementController());
    const mockSetSelected = jest.fn();
    const mockEntities = [{ id: 1, name: 'Test Entity' }];

    expect(result.current.isEditing).toBe(false);

    act(() => {
      result.current.handleEditClick(1, mockSetSelected, mockEntities);
    });

    expect(result.current.editingEntity).toBe(1);
    expect(result.current.isEditing).toBe(true);
    expect(mockSetSelected).toHaveBeenCalledWith({ id: 1, name: 'Test Entity' });

    act(() => {
      result.current.handleEditCancel(mockSetSelected);
    });

    expect(result.current.editingEntity).toBe(null);
    expect(result.current.isEditing).toBe(false);
  });

  it('should handle search state', () => {
    const { result } = renderHook(() => useEntityManagementController());
    const mockApplyFilters = jest.fn();

    expect(result.current.hasActiveSearch).toBe(false);

    act(() => {
      result.current.handleSearchChange(mockApplyFilters, 'test search');
    });

    expect(result.current.searchTerm).toBe('test search');
    expect(result.current.hasActiveSearch).toBe(true);
    expect(mockApplyFilters).toHaveBeenCalledWith({ search: 'test search' });
  });
});
```

## Best Practices

### 1. Clear Separation of Concerns

```typescript
// ✅ Good - business hook focuses on business logic
export const useEntityBusiness = () => {
  // Data fetching, validation, business rules
  const entities = entityRepository.queries.useEntities();

  const createEntity = useCallback((data) => {
    if (!data.name) throw new Error('Name required'); // Business validation
    return createMutation.mutate(data);
  }, []);

  return { entities, createEntity };
};

// ✅ Good - controller hook focuses on UI
export const useEntityController = () => {
  // UI state, interactions, presentation logic
  const [showForm, setShowForm] = useState(false);

  const handleCreateClick = () => setShowForm(true);

  return { showForm, handleCreateClick };
};

// ❌ Avoid - mixing concerns
export const useEntityMixed = () => {
  const entities = entityRepository.queries.useEntities(); // Business
  const [showForm, setShowForm] = useState(false); // UI
  const { showDialog } = useShowDialog(); // UI

  const createEntity = useCallback((data) => {
    // Business + UI mixed
    if (!data.name) {
      showDialog({ message: 'Name required' }); // UI concern in business logic
      return;
    }
    return createMutation.mutate(data);
  }, []);
};
```

### 2. Consistent Parameter Patterns

```typescript
// ✅ Good - controller receives business functions as parameters
const handleSubmit = useCallback(
  (businessActionFn: (data: FormData) => Promise<void>) => async (formData: FormData) => {
    try {
      await businessActionFn(formData);
      setShowForm(false);
      showSuccessToast();
    } catch (error) {
      showErrorToast(error.message);
    }
  },
  [],
);

// ❌ Avoid - controller directly accessing business logic
const handleSubmit = useCallback(async (formData: FormData) => {
  try {
    await entityRepository.mutations.useCreateEntity(); // Direct dependency
    setShowForm(false);
  } catch (error) {
    // Handle error
  }
}, []);
```

### 3. Proper Error Boundaries

```typescript
// ✅ Good - business hook handles business errors
export const useEntityBusiness = () => {
  const createEntity = useCallback(async (data) => {
    try {
      if (!data.name?.trim()) {
        throw new Error('Entity name is required');
      }

      return await createMutation.mutateAsync(data);
    } catch (error) {
      // Log business errors, but let UI handle user feedback
      console.error('Business logic error:', error);
      throw error; // Re-throw for UI to handle
    }
  }, []);

  return { createEntity };
};

// ✅ Good - controller handles UI feedback
export const useEntityController = () => {
  const handleCreateSubmit = useCallback(
    (createEntityFn: (data: EntityData) => Promise<void>) => async (data: EntityData) => {
      try {
        await createEntityFn(data);
        showToast('Entity created successfully', 'success');
        setShowForm(false);
      } catch (error) {
        showToast(`Failed to create entity: ${error.message}`, 'error');
      }
    },
    [],
  );

  return { handleCreateSubmit };
};
```

### 4. Testable Hooks

```typescript
// ✅ Good - easily testable business logic
export const useEntityBusiness = (dataSource: DataSource = 'http') => {
  // Clear inputs and outputs, easy to mock dependencies
  const createEntity = useCallback(async (data: CreateEntityRequest) => {
    // Pure business logic, no UI dependencies
    const validatedData = validateEntityData(data);
    return createMutation.mutateAsync(validatedData);
  }, []);

  return { createEntity }; // Clear return interface
};

// ✅ Good - testable UI logic
export const useEntityController = () => {
  const [state, setState] = useState(initialState);

  // Pure UI logic, receives business actions as parameters
  const handleAction = useCallback((businessFn) => {
    setState(newState);
    businessFn();
  }, []);

  return { state, handleAction };
};
```

## Benefits

### ✅ Advantages

1. **Separation of Concerns**: Business logic and UI logic are clearly separated
2. **Testability**: Each hook type can be tested independently
3. **Reusability**: Business hooks can be reused across different UIs
4. **Maintainability**: Changes to business rules don't affect UI code
5. **Type Safety**: Clear interfaces between business and UI layers
6. **Developer Experience**: Predictable patterns across the application

### ⚠️ Trade-offs

1. **Initial Complexity**: More boilerplate than combining everything
2. **Learning Curve**: Developers need to understand the separation pattern
3. **Parameter Passing**: Controller hooks receive functions as parameters

## Related Patterns

- [Repository Pattern](./repository-pattern.md) - Business hooks use repositories
- [Selector Pattern](./selector-pattern.md) - Business hooks compose selectors
- [Gateway Pattern](./gateway-pattern.md) - Business hooks interact with different data sources
- [Component Architecture](./component-architecture.md) - How hooks integrate with components
