# Create Nextlane App

Official CLI tool to bootstrap modern frontend applications with Nextlane's template.

## 🚀 Quick Start

```bash
npx github:nxl-engineering/shared-create-nextlane-app
```

**Requirements:**

- ✅ GitHub account associated with Nextlane organization
- ✅ Access to `nxl-engineering/shared-create-nextlane-app` repository
- ✅ Node.js installed
- ✅ Internet connection

## 💡 Example Usage

```bash
$ npx github:nxl-engineering/shared-create-nextlane-app

🚀 Create Nextlane App
Bootstrap a modern frontend application with Nextlane's template

Project name (kebab-case): my-awesome-project
Package name (default: my-awesome-project):
Project description: My awesome Nextlane application
Target directory (default: ./my-awesome-project, use "." for current):

📋 Configuration Summary:
Project Name: my-awesome-project
Package Name: my-awesome-project
Description: My awesome Nextlane application
Target Directory: ./my-awesome-project

🔄 Creating project...
🔧 Initializing git repository...
✅ Git repository initialized
📡 Downloading template from GitHub...
📦 Extracting template...
📋 Copying .gitignore from template...
✅ .gitignore copied successfully
📄 Copying template files...
✅ Package.json copied from template
✅ Package.json placeholders replaced
🔄 Configuring project...

🎉 Project created successfully!

Next steps:
1. cd ./my-awesome-project
2. Configure your environment variables in .env.local (already created from template)
3. Install dependencies (choose your preferred package manager):
   npm install | yarn install | pnpm install
4. Start development server:
   npm run dev | yarn dev | pnpm dev

📦 Features Included:
⚡ Next.js x.x.x + React x.x.x
🎨 Material-UI x.x.x + Design System
🔧 TypeScript x.x.x configured
📱 Responsive design
🌍 Internationalization (next-intl x.x.x)
🎯 ESLint x.x.x + Prettier x.x.x
🧪 Jest x.x.x + Testing Library x.x.x
📊 Redux Toolkit x.x.x + RTK Query
🎨 SCSS x.x.x Modules + Style Dictionary x.x.x
🔒 Husky x.x.x + lint-staged x.x.x

Happy coding! 🚀
```

## 🛠️ Development and Testing

For development and testing locally:

```bash
# Clone the repository
git clone https://github.com/nxl-engineering/shared-create-nextlane-app.git
cd shared-create-nextlane-app

# Install dependencies
yarn install

# Test the CLI interactively
yarn test-cli-interactive

# Run automated tests
yarn test-cli

# Test directly
node ./bin/create-nextlane-app.js
```

## 📦 Generated Project Structure

```
my-awesome-project/
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── docs/
├── public/
├── package.json
├── README.md
├── next.config.js
├── tsconfig.json
└── .gitignore
```

## 🔧 Features Included

- ⚡ Next.js 15 + React 19
- 🎨 Material-UI (MUI) + Design System
- 🔧 TypeScript configured
- 📱 Responsive design
- 🌍 Internationalization (next-intl)
- 🎯 ESLint + Prettier
- 🧪 Jest + Testing Library
- 📊 Redux Toolkit + RTK Query
- 🎨 SCSS Modules
- 🔒 Husky + lint-staged

## 🚀 Release Management

This project uses **semantic release** for automated versioning based on conventional commits. No manual version management is required.

### How it works:

1. **Make changes** using conventional commit format
2. **Create PR** to `main` branch
3. **Merge PR** - Semantic release automatically:
   - 🏷️ Creates git tag with new version
   - 📋 Generates CHANGELOG.md
   - 🎉 Publishes GitHub release
   - 📦 Users get latest version with `npx github:`

### Automatic Version Bumps:

- `feat:` → **MINOR** version (1.0.0 → 1.1.0)
- `fix:`, `perf:` → **PATCH** version (1.0.0 → 1.0.1)
- `feat!:`, `BREAKING CHANGE:` → **MAJOR** version (1.0.0 → 2.0.0)

## 🤝 Contributing

We use **trunk-based development** with **semantic release** for automated versioning.

### 🌿 Branch Types

```bash
# ✅ Short-lived branches (1-3 days max)
feature/add-template-validation    # New functionality
fix/cli-initialization-error       # Bug fixes
hotfix/critical-security-patch     # Urgent fixes
chore/update-dependencies          # Maintenance
docs/improve-readme               # Documentation
```

### 📝 Commit Format (Required)

We use **Conventional Commits** validated by Husky:

```bash
# ✅ Correct format
feat: add TypeScript template support     # Minor release (1.0.0 → 1.1.0)
fix: resolve CLI initialization error     # Patch release (1.0.0 → 1.0.1)
docs: update installation guide          # No release
chore: update eslint configuration       # No release
perf: optimize template download          # Patch release
refactor: improve validation logic        # No release

# Breaking changes (Major release 1.0.0 → 2.0.0)
feat!: redesign CLI interface
feat: change argument structure

BREAKING CHANGE: --name flag is now --project-name
```

### 🔄 Development Workflow

1. **Create short branch:**

   ```bash
   git checkout -b feature/improve-error-messages
   ```

2. **Make conventional commits:**

   ```bash
   git commit -m "feat: improve CLI error display"
   git commit -m "test: add error handling tests"
   ```

3. **Push and create PR:**

   ```bash
   git push origin feature/improve-error-messages
   # Create PR on GitHub
   ```

4. **After PR merge to main:**
   - 🚀 Semantic release runs automatically
   - 🏷️ Git tag created with new version
   - 📋 CHANGELOG.md generated and included in release
   - 🎉 GitHub release published
   - 📦 Package.json version stays at 0.0.0 (versions tracked via git tags)

### 🎯 Automatic Releases

| Commit Type                             | Version Bump   | Example       |
| --------------------------------------- | -------------- | ------------- |
| `feat:`                                 | **MINOR**      | 1.0.0 → 1.1.0 |
| `fix:`, `perf:`, `hotfix:`              | **PATCH**      | 1.0.0 → 1.0.1 |
| `feat!:`, `BREAKING CHANGE:`            | **MAJOR**      | 1.0.0 → 2.0.0 |
| `docs:`, `chore:`, `test:`, `refactor:` | **NO RELEASE** | -             |

### ✅ Validation

- Husky validates commit format before commit
- Invalid commits are rejected automatically
- PR validation ensures code quality before merge

## ⚠️ Common Warnings & Workarounds

### Package Manager Warnings

You may encounter these warnings during installation that are **safe to ignore**:

```bash
warning @zip.js/zip.js@2.7.63: The engine "deno" appears to be invalid.
warning @zip.js/zip.js@2.7.63: The engine "bun" appears to be invalid.
warning Workspaces can only be enabled in private projects.
warning package-lock.json found. Your project contains lock files generated by tools other than Yarn.
```

**These warnings:**

- ✅ Do not affect functionality
- ✅ Are caused by package engine specifications
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
  },
  "overrides": {
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}
```

These resolutions prevent version conflicts and reduce warning messages during installation.

### Node.js Compatibility

- Ensure you're using Node.js 18+ for best compatibility
- Some warnings may appear with Node.js 20+ due to dependency engine requirements

## 📚 Additional Documentation

Here you have some documentation about the generated project. Please, read it before starting to work with it and ask anybody in the team if you have any question, find something that is not understandable or if you think something is missing or can be improved.

- [Setup](docs/setup.md)
- [Testing](docs/testing.md)
- [Internationalization](docs/intl.md)
- [Rules and Conventions](docs/rules-conventions.md)
- [Project Structure](docs/project-structure.md)

## External Libraries

- [MUI](https://mui.com/) - React UI framework.
- [Next-Intl](https://next-intl-docs.vercel.app/) - Library for internationalization (i18n) in Next.js applications.
- [Redux Toolkit](https://redux-toolkit.js.org/) - Official, opinionated, batteries-included toolset for efficient Redux development.
- [React-Hook-Form](https://react-hook-form.com/) - Library for handling form validation and management in React applications.
- [Jest](https://jestjs.io/docs/tutorial-react) - JavaScript testing framework.
- [MixPanel](https://github.com/mixpanel/mixpanel-js) - Analytics platform.
- [Screeb](https://github.com/ScreebApp/sdk-js) - User feedback and survey platform.
- [Husky](https://github.com/typicode/husky) - Automatically lint your commit messages, code, and run tests upon committing or pushing.

## 📄 License

This project is for internal use at Nextlane.

## 🔄 Development Status

Currently using trunk-based development with semantic release for automated versioning.
