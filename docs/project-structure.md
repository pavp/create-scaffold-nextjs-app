# Project Structure

The project follows **Clean Architecture** principles with clear separation of concerns. If you open the new project in an editor, you will see the following structure:

```sh
.
├── src/
│   ├── api/                    ## Shared API configuration
│   │   ├── endpoints.ts        ## API endpoint definitions
│   │   ├── http-client.ts      ## HTTP client setup
│   │   └── types.ts            ## API types
│   ├── app/                    ## Next.js App Router
│   │   ├── [locale]/           ## Internationalized routes
│   │   └── layout.tsx          ## Root layout
│   ├── components/             ## Reusable UI components
│   │   ├── loading-screen/
│   │   └── footer/
│   ├── modules/                ## Feature modules (Clean Architecture)
│   │   ├── [module-name]/      ## Each module contains:
│   │   │   ├── api/            ## HTTP client integration
│   │   │   ├── components/     ## Module-specific components
│   │   │   ├── repositories/   ## Data access abstraction
│   │   │   │   └── [entity]/
│   │   │   │       ├── gateways/        ## Data source abstraction
│   │   │   │       │   ├── http-gateway/
│   │   │   │       │   ├── localStorage-gateway/
│   │   │   │       │   └── mock-gateway/
│   │   │   │       ├── helpers/         ## Business logic utilities
│   │   │   │       ├── [entity].query-options.ts
│   │   │   │       ├── [entity].repository.queries.ts
│   │   │   │       └── [entity].repository.mutations.ts
│   │   │   ├── selectors/      ## State selection hooks
│   │   │   ├── stores/         ## Module state management
│   │   │   ├── views/          ## Feature views with business/controller hooks
│   │   │   ├── hooks/          ## Shared module hooks
│   │   │   ├── index.ts        ## Module exports
│   │   │   └── [module].types.ts ## Module types
│   ├── core/                   ## Core shared functionality
│   │   ├── components/         ## Shared core components
│   │   ├── hooks/              ## Shared hooks
│   │   ├── helpers/            ## Utility functions
│   │   ├── layouts/            ## Layout components
│   │   └── lib/                ## External library integrations
│   │       ├── react-query/    ## React Query helpers and configuration
│   │       └── zustand/        ## Zustand store utilities
│   ├── hooks/                  ## Custom React hooks
│   ├── i18n/                   ## Internationalization configuration
│   ├── navigation/             ## Navigation utilities
│   ├── shared/                 ## Shared utilities and types
│   │   ├── api/                ## Shared API utilities
│   │   ├── gateways/           ## Base gateway types
│   │   └── types/              ## Shared types
│   ├── styles/                 ## Design tokens and styling
│   ├── types/                  ## Global TypeScript types
│   │   └── index.ts
│   └── ui/                     ## Design system components
│       ├── button/
│       ├── modal/
│       ├── form/
│       └── index.ts
├── docs/                       ## Project documentation
├── test/                       ## Test utilities and configuration
│   ├── utils/                  ## Testing utilities
│   ├── entities/               ## Mock data factories
│   └── __mocks__/              ## Jest mocks
├── public/                     ## Static assets
└── package.json
```

## Directory Descriptions

### Core Directories

- **`api/`**: Shared API configuration including HTTP client setup, endpoints, and base API types. This is the foundation for all API communications.

- **`app/`**: Next.js App Router structure with internationalized routes using `[locale]` dynamic segments for multi-language support.

- **`components/`**: Reusable UI components specific to this project. These components are used across multiple modules but are not generic enough for the design system.

### Feature Modules (`modules/`)

Each module follows Clean Architecture patterns and represents a business domain (e.g., user management, product catalog, etc.). Every module contains:

#### Data Layer

- **`api/`**: HTTP client integration with Zod validation
- **`repositories/`**: Data access abstraction with React Query integration
- **`gateways/`**: Data source abstraction (HTTP, localStorage, mock, etc.)

#### Application Layer

- **`selectors/`**: State selection and derived data computation hooks
- **`stores/`**: Module-specific Zustand stores for local state

#### Presentation Layer

- **`components/`**: Module-specific UI components
- **`views/`**: Complete page views with business and controller hooks
- **`hooks/`**: Shared module hooks for common functionality

### Shared Infrastructure

- **`core/`**: Shared functionality that can be reused across projects. Contains components, hooks, and utilities without business logic dependencies.

- **`hooks/`**: Custom React hooks for shared functionality across the application.
- **`i18n/`**: Internationalization configuration and locale management.
- **`navigation/`**: Navigation utilities and routing helpers.

- **`shared/`**: Project-specific shared utilities:
  - **`api/`**: HTTP client and API utilities
  - **`gateways/`**: Base gateway interfaces and types
  - **`types/`**: Shared TypeScript definitions

### Global Configuration

- **`store/`**: Global application state management for cross-module concerns (user session, UI settings, etc.).

- **`types/`**: Global TypeScript type definitions shared across the entire application.

### Design System

- **`ui/`**: Generic design system components with theming. These components can be reused across projects and form the foundation of the UI.

### Testing & Documentation

- **`test/`**: Comprehensive testing infrastructure:
  - **`utils/`**: Testing utilities with provider wrappers
  - **`entities/`**: Faker-based mock data factories
  - **`__mocks__/`**: Jest mocks for external dependencies

- **`docs/`**: Architecture documentation and development guides

## Clean Architecture Benefits

This structure provides several advantages:

### ✅ **Separation of Concerns**

- **Data Layer**: Handles all data access and external integrations
- **Application Layer**: Contains business logic and state management
- **Presentation Layer**: Focuses purely on UI rendering and user interactions

### ✅ **Testability**

- Each layer can be tested independently
- Mock data factories provide consistent test data
- Repository pattern enables easy mocking of data sources

### ✅ **Flexibility**

- Easy to switch between data sources (HTTP ↔ localStorage ↔ mock)
- Gateway pattern abstracts data source implementation details
- Modular structure supports feature-based development

### ✅ **Scalability**

- Consistent patterns across all modules
- Clear boundaries prevent coupling between features
- Independent module development by different team members

## Importing Files

We use **absolute imports** with TypeScript path mapping to avoid long relative paths and make the code cleaner and more readable.

### Import Examples

```typescript
// UI components from design system
import { Button, Typography, Box } from '@/ui';

// Project-specific components
import { Header, LoadingScreen } from '@/components';

// Module exports (repositories, selectors, types)
import { todoRepository, useTodoStatsSelector } from '@/modules/todo';
import type { Todo, CreateTodoRequest } from '@/modules/todo';

// Core utilities and hooks
import { useApiClient, formatDate } from '@/core';

// Shared types and utilities
import type { DataSource } from '@/types/gateway.types';
import { httpClient } from '@/shared/api/http-client';

// Test utilities
import { renderWithProviders, createMockTodo } from '@test/utils';
```

### Path Mapping Configuration

The following aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/core/*": ["./src/core/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/core/*": ["./src/core/*"],
      "@/ui/*": ["./src/ui/*"],
      "@test/*": ["./test/*"]
    }
  }
}
```

## Related Documentation

- **[Module Architecture](./module-architecture.md)** - Detailed explanation of Clean Architecture principles
- **[Developer Guide](./developer-guide.md)** - Step-by-step guide for creating new modules
- **[Repository Pattern](./repository-pattern.md)** - Data access abstraction implementation
- **[Gateway Pattern](./gateway-pattern.md)** - Data source abstraction patterns
- **[Testing Guide](./testing.md)** - Comprehensive testing strategies and utilities
