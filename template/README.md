# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## 💡 Getting Started

1. **Development**: Run `yarn dev` to start the development server
2. **Open**: Navigate to [http://localhost:3000](http://localhost:3000)
3. **Edit**: Start editing pages in the `src/app` directory
4. **Build**: Run `yarn build` when ready to deploy

## 🛠️ Development

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix
```

## 🤝 Development Guidelines

### 🌿 Branch Naming (Required)

Branch names are **automatically validated** by pre-push hooks and GitHub Actions:

```bash
# ✅ Required format: type/description
feat/add-user-authentication      # New functionality
fix/resolve-login-bug             # Bug fixes
hotfix/critical-security-patch    # Urgent fixes
chore/update-dependencies         # Maintenance
docs/update-readme               # Documentation
refactor/simplify-validation     # Code refactoring
test/add-integration-tests       # Testing improvements
perf/optimize-build-process      # Performance improvements
```

**Validation Rules:**

- Format: `type/description` (lowercase only)
- Types: `feat`, `fix`, `hotfix`, `chore`, `docs`, `refactor`, `test`, `perf`
- Description: lowercase letters, numbers, and hyphens only
- Duration: Keep branches short-lived (1-3 days max)

**Validation enforced at:**

- **Local**: Pre-push hook prevents push with invalid names
- **GitHub Actions**: PR validation ensures branch name compliance
- **Manual check**: Run `yarn validate:branch` anytime

### 📝 Commit Format (Required)

We use **Conventional Commits** validated by Husky:

```bash
# ✅ Correct format
feat: add user authentication system
fix: resolve login validation error
docs: update API documentation
chore: update dependencies to latest versions

# With scope (optional - for better organization)
feat(auth): add social login integration
fix(ui): resolve button alignment issue
docs(modules): update module documentation

# Breaking changes
feat!: redesign authentication flow
feat(api)!: change user endpoint structure

BREAKING CHANGE: User API now requires authentication token
```

**Commit types that trigger releases:**

- `feat:` → **Minor release** (1.0.0 → 1.1.0)
- `fix:`, `perf:` → **Patch release** (1.0.0 → 1.0.1)
- `feat!:`, `BREAKING CHANGE:` → **Major release** (1.0.0 → 2.0.0)

**Other types (no release):**

- `docs:`, `chore:`, `test:`, `style:`, `refactor:`

**Available scopes (optional):**

- Clean Architecture: `modules`, `core`, `shared`, `types`
- UI & Components: `ui`, `components`
- API & Data: `api`, `actions`, `auth`
- App Structure: `app`, `navigation`, `i18n`, `hooks`
- Design Tokens: `styles`, `tokens`, `design-tokens`
- Infrastructure: `config`, `build`, `test`, `lint`
- Dependencies: `dependencies`, `deps`

**Validation enforced at:**

- **Automatic**: Husky validates format on every commit
- **Manual**: `yarn validate:commits` or `yarn commit` (interactive guidance)

### 🔄 Development Workflow

1. **Create branch** with correct naming:

   ```bash
   git checkout -b feat/add-user-dashboard
   ```

2. **Make commits** using conventional format:

   ```bash
   git commit -m "feat(ui): add user dashboard component"
   git commit -m "test(ui): add dashboard component tests"
   ```

3. **Push and create PR**:

   ```bash
   git push origin feat/add-user-dashboard
   # Create PR on GitHub
   ```

4. **Automated validation** runs:
   - ✅ Branch name validation
   - ✅ Commit format validation
   - ✅ Lint, test, and build checks

5. **After merge**: Semantic release automatically creates new version if applicable

## 📦 Project Structure

```
{{PACKAGE_NAME}}/
├── src/
│   ├── actions/                # Server actions
│   ├── api/                    # Shared API configuration
│   ├── app/                    # Next.js App Router
│   ├── components/             # Reusable UI components
│   ├── core/                   # Shared core functionality
│   ├── hooks/                  # Custom React hooks
│   ├── i18n/                   # Internationalization configuration
│   ├── modules/                # Feature modules (Clean Architecture)
│   ├── navigation/             # Navigation utilities
│   ├── shared/                 # Shared utilities and types
│   ├── styles/                 # Design tokens and styling
│   ├── types/                  # Global TypeScript types
│   └── ui/                     # Design system components
├── docs/                       # Project documentation
├── test/                       # Test utilities and configuration
├── public/                     # Static assets
├── package.json
├── README.md
├── next.config.mjs
├── tsconfig.json
└── .gitignore
```

## 🔧 Features Included

- ⚡ Next.js 15 + React 19
- 🎨 Material-UI (MUI) + Design System
- 🔧 TypeScript configured
- 📱 Responsive design
- 🌍 Internationalization (next-intl)
- 🎯 ESLint + Prettier + Stylelint
- 🧪 Jest + Testing Library with V8 Coverage
- 📊 React Query + Zustand
- 🎨 SCSS Modules
- 🔒 Husky + lint-staged

## ⚠️ Common Warnings

### Package Manager Warnings

You may encounter these warnings during installation that are **safe to ignore**:

```bash
warning @zip.js/zip.js@2.7.63: The engine "deno" appears to be invalid.
warning @zip.js/zip.js@2.7.63: The engine "bun" appears to be invalid.
warning Workspaces can only be enabled in private projects.
warning package-lock.json found. Your project contains lock files generated by tools other than Yarn.
npm warn peer react@">=16.8.0" from @emotion/react@11.14.0
```

**These warnings:**

- ✅ Do not affect functionality
- ✅ Are caused by package engine specifications and React version differences
- ✅ Can be safely ignored during development

### Package Resolution Warnings

Some dependency conflicts are resolved using package resolutions in package.json:

```json
{
  "resolutions": {
    "@types/react": "19.0.10",
    "@types/react-dom": "19.0.4",
    "glob": "^10.0.0",
    "rimraf": "^5.0.0"
  }
}
```

These resolutions prevent version conflicts and reduce warning messages during installation.

### Node.js Compatibility

- Ensure you're using Node.js 18+ for best compatibility
- Some warnings may appear with Node.js 20+ due to dependency engine requirements

## 📚 Documentation

Here you have some documentation about this project. Please, read it before starting to work with it and ask anybody in the team if you have any question, find something that is not understandable or if you think something is missing or can be improved.

### Getting Started

- [Setup](docs/setup.md)
- [Design Tokens](docs/design-tokens.md) - Comprehensive design tokens system with Style Dictionary
- [Sign in](docs/signin.md)
- [Testing](docs/testing.md)
- [Internationalization](docs/intl.md)
- [Rules and Conventions](docs/rules-conventions.md)
- [Project Structure](docs/project-structure.md)
- [File Naming Conventions](docs/file-naming-conventions.md) - Guidelines for consistent file naming

### Architecture & Patterns

- [Module Architecture](docs/module-architecture.md) - Clean Architecture principles and layer separation
- [Repository Pattern](docs/repository-pattern.md) - Data access abstraction with React Query integration
- [Gateway Pattern](docs/gateway-pattern.md) - Data source abstraction (HTTP, localStorage, mock)
- [Selector Pattern](docs/selector-pattern.md) - State selection and derived data computation
- [Hook Patterns](docs/hook-patterns.md) - Business and Controller hook separation patterns

### Development Guide

- [Developer Guide](docs/developer-guide.md) - Complete step-by-step guide for creating modules and features
- [Analytics and Feedback](docs/analytics-and-feedback.md) - Template-friendly analytics and feedback systems

## External Libraries

- [MUI](https://mui.com/) - React UI framework.
- [Next-Intl](https://next-intl-docs.vercel.app/) - Library for internationalization (i18n) in Next.js applications.
- [React Query](https://tanstack.com/query) - Powerful data synchronization for React applications.
- [Zustand](https://zustand-demo.pmnd.rs/) - Small, fast and scalable bearbones state-management solution.
- [React-Hook-Form](https://react-hook-form.com/) - Library for handling form validation and management in React applications.
- [Jest](https://jestjs.io/docs/tutorial-react) - JavaScript testing framework.
- [MixPanel](https://github.com/mixpanel/mixpanel-js) - Analytics platform.
- [Screeb](https://github.com/ScreebApp/sdk-js) - User feedback and survey platform.
- [Husky](https://github.com/typicode/husky) - Automatically lint your commit messages, code, and run tests upon committing or pushing.

## 📄 License

This project is for internal use at Nextlane.
