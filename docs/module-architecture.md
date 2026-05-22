# Module Architecture

This document explains the architectural patterns implemented across feature modules in the application, following Clean Architecture principles.

## Overview

Feature modules follow **Clean Architecture** principles with clear separation of concerns, dependency inversion, and testability. This architecture demonstrates how to structure complex features with multiple data sources, business logic, and UI patterns.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                        Views Layer                          │
│  ┌─────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│  │   Components    │ │  Business Hooks  │ │Controller    │ │
│  │                 │ │                  │ │Hooks         │ │
│  └─────────────────┘ └──────────────────┘ └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│  ┌─────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│  │   Selectors     │ │   Repositories   │ │   Stores     │ │
│  │                 │ │                  │ │              │ │
│  └─────────────────┘ └──────────────────┘ └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                     │
│  ┌─────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│  │      API        │ │     Gateways     │ │   Helpers    │ │
│  │                 │ │                  │ │              │ │
│  └─────────────────┘ └──────────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Core Principles

### 1. **Dependency Inversion**

- Views depend on abstractions (repositories, selectors)
- Business logic doesn't depend on UI or infrastructure
- Infrastructure implements interfaces defined by business layer

### 2. **Single Responsibility**

- Each layer has a specific purpose
- Components focus on UI rendering
- Business hooks handle application logic
- Gateways manage data access

### 3. **Testability**

- All layers can be tested independently
- Dependency injection enables easy mocking
- Pure functions for business logic

### 4. **Scalability**

- New features follow established patterns
- Consistent file structure across modules
- Reusable components and utilities

## Layer Responsibilities

### Views Layer

- **Components**: Pure UI rendering and event handling
- **Business Hooks**: Application logic, data transformations, business rules
- **Controller Hooks**: UI state management, user interactions, UI patterns

### Application Layer

- **Selectors**: Data selection and derived state computation
- **Repositories**: Data access abstraction and React Query integration
- **Stores**: Global state management with Zustand

### Infrastructure Layer

- **API**: HTTP client integration and data validation
- **Gateways**: Data source abstraction (HTTP, localStorage, etc.)
- **Helpers**: Utility functions and data transformations

## Data Flow

```
User Interaction → Controller Hook → Business Hook → Repository → Gateway → API
                      ↓                 ↓              ↓          ↓        ↓
                 UI State Update   Business Logic   React Query   Data     HTTP
                                                    Cache         Source   Request
```

## Benefits

### ✅ Advantages

- **Maintainability**: Clear separation makes code easy to understand and modify
- **Testability**: Each layer can be tested independently with proper mocks
- **Flexibility**: Easy to switch data sources or UI frameworks
- **Consistency**: Standardized patterns across all modules
- **Type Safety**: TypeScript interfaces ensure contract compliance
- **Performance**: React Query caching and selective re-renders

### ⚠️ Considerations

- **Initial Complexity**: More files and abstractions than simple approaches
- **Learning Curve**: Developers need to understand the architectural patterns
- **File Count**: More files per feature (but better organization)

## When to Use This Architecture

**✅ Use for:**

- Complex features with business logic
- Features requiring multiple data sources
- Long-term applications requiring maintainability
- Teams with multiple developers
- Features requiring extensive testing

**❌ Consider simpler approaches for:**

- Simple CRUD operations without business logic
- Prototypes or short-term projects
- Very small teams (1-2 developers)
- Features with minimal complexity

## Next Steps

- [Repository Pattern](./repository-pattern.md) - Detailed explanation of the repository layer
- [Gateway Pattern](./gateway-pattern.md) - Data source abstraction implementation
- [Selector Pattern](./selector-pattern.md) - State selection and derived data
- [Hook Patterns](./hook-patterns.md) - Business and Controller hook separation
- [Developer Guide](./developer-guide.md) - Step-by-step development guide
