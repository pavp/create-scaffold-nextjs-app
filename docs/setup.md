# Getting Started

## Prerequisites

- **Node.js** 18+ installed on your system
- **Yarn** package manager (recommended) or npm
- **VSCode** (recommended editor)

## Quick Start

### 1. Clone and Install

```sh
# Clone the repository
git clone <repository-url>
cd project-name

# Install dependencies
yarn install
```

### 2. Environment Setup

Copy environment variables (if needed):

```sh
cp .env.example .env.local
```

### 3. Start Development

```sh
# Build style dictionary and start development server
yarn dev
```

### 4. Open Application

Open your web browser and navigate to [http://localhost:3000](http://localhost:3000)

## Technology Stack

This project uses modern technologies:

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety

### State Management

- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **Immer** - Immutable state updates

### Styling

- **MUI v7** - Component library
- **SCSS Modules** - Scoped styling
- **Style Dictionary** - Design tokens

### Testing

- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **Faker.js** - Mock data generation

### Development Tools

#### Code Quality & Linting

- **ESLint v9** - JavaScript/TypeScript code linting with flat configuration
  - Enforces code style, detects potential bugs, and maintains consistency
  - Integrated with Prettier for seamless formatting
  - Custom rules for file naming conventions and import organization
  - Supports both `.js`/`.ts` files and React components

- **Stylelint v16** - CSS/SCSS code linting and formatting
  - Professional CSS quality rules (no duplicate selectors, proper specificity)
  - SCSS syntax support with PostCSS integration
  - Automatic property ordering for consistent styling
  - CSS Modules compatibility with camelCase class names

- **Prettier** - Code formatting (JavaScript/TypeScript/JSON/Markdown)
  - Handles general code formatting across multiple file types
  - Integrated with ESLint to avoid conflicts
  - Automatic formatting on save in VSCode

#### Git Workflow & Quality

- **Husky** - Git hooks for code quality enforcement
  - Pre-commit hooks run linting and formatting automatically
  - Pre-push hooks ensure tests pass and build succeeds
  - Prevents commits with linting errors or formatting issues

- **Commitlint** - Commit message validation
  - Enforces conventional commit format
  - Supports scoped commits with predefined types
  - Integrated with git hooks for automatic validation

- **lint-staged** - Run linters on staged files
  - Only processes modified files for faster execution
  - Runs ESLint, Stylelint, and Prettier on appropriate file types
  - Automatic fixing and formatting before commits

## Development Commands

### Core Commands

```sh
# Development server with hot reload
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Type checking
yarn typecheck

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run all linters (ESLint + Stylelint)
yarn lint

# Fix all linting issues automatically
yarn lint:fix

# Run only CSS/SCSS linting
yarn lint:styles

# Fix only CSS/SCSS linting issues
yarn lint:styles:fix
```

### Build Process

The build process includes:

1. **Style Dictionary** - Generates design tokens
2. **TypeScript Compilation** - Type checking
3. **Next.js Build** - Optimized production build

## VSCode Setup

### Recommended Extensions

#### Essential Extensions

1. **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)** - JavaScript/TypeScript linting
   - Provides real-time linting and auto-fix capabilities
   - Integrated with project's ESLint v9 flat configuration
   - Set as default formatter for `.js`, `.ts`, `.jsx`, `.tsx` files

2. **[Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)** - CSS/SCSS linting
   - Professional CSS quality enforcement
   - Auto-fix on save for CSS/SCSS files
   - Integrates with project's Stylelint v16 configuration

3. **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)** - Code formatting
   - Handles general code formatting
   - Works seamlessly with ESLint configuration
   - Set as formatter for SCSS files with Stylelint code actions

#### Development Productivity

4. **[TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter)** - Auto imports
   - Automatically imports TypeScript modules
   - Works with project's absolute path configuration (`@/` aliases)

5. **[Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner)** - Run tests inline
   - Run individual tests directly from editor
   - Integrates with project's Jest configuration

6. **[SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss)** - SCSS support
   - Enhanced SCSS syntax highlighting and IntelliSense
   - CSS Modules support for `.module.scss` files

### Workspace Settings

The project includes comprehensive VSCode workspace settings (`.vscode/settings.json`) for:

#### Formatter Configuration

- **ESLint** as default formatter for JavaScript/TypeScript files
- **Prettier** as formatter for SCSS files with Stylelint code actions
- Auto-formatting on save enabled across all supported file types

#### Code Quality Integration

- ESLint real-time linting and auto-fix on save
- Stylelint integration with auto-fix for CSS/SCSS files
- TypeScript path mapping with `@/` aliases
- CSS Modules support for `.module.scss` files

#### Development Features

- Jest test discovery and execution
- Proper file associations for all project file types
- Optimized settings for development workflow

## Architecture Overview

This project follows **Clean Architecture** principles:

```
src/
├── modules/           # Feature modules (Clean Architecture)
├── core/              # Shared core functionality
├── ui/                # Design system components
├── shared/            # Shared utilities and types
└── lib/               # External library integrations
```

### Key Patterns

- **Repository Pattern** - Data access abstraction
- **Gateway Pattern** - Data source abstraction (HTTP/localStorage/mock)
- **Selector Pattern** - State selection with Zustand
- **Hook Separation** - Business logic vs Controller hooks

## Next Steps

After setup, check out:

- **[Project Structure](./project-structure.md)** - Understand the codebase organization
- **[Developer Guide](./developer-guide.md)** - Learn how to create new features
- **[Testing Guide](./testing.md)** - Write comprehensive tests
- **[Rules & Conventions](./rules-conventions.md)** - Follow project standards

## Troubleshooting

### Common Issues

**Port 3000 already in use:**

```sh
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Node version issues:**

```sh
# Check Node.js version (requires 18+)
node --version

# Update Node.js if needed
nvm install node
nvm use node
```

**Yarn not found:**

```sh
# Install Yarn globally
npm install -g yarn

# Or use corepack (Node.js 16.10+)
corepack enable
```

**Style Dictionary build fails:**

```sh
# Manual style dictionary build
yarn build:dictionary
```
