# Contributing Guide

## 🌳 Workflow Overview

This project uses **trunk-based development** with collaborative workflow.

## 🌿 Branch Naming (Required & Validated)

Branch names are **automatically validated** by pre-push hooks and GitHub Actions:

```bash
# ✅ Required format: type/description (lowercase only)
feat/add-new-component           # New functionality
fix/validation-error             # Bug fixes
hotfix/critical-security-patch   # Urgent fixes
chore/update-dependencies        # Maintenance
docs/improve-readme             # Documentation
refactor/simplify-validation    # Code refactoring
test/add-integration-tests      # Testing improvements
perf/optimize-build-process     # Performance improvements
```

**Validation enforced at:**

- **Local**: Pre-push hook prevents push with invalid names
- **CI**: GitHub Actions validates PR branch names
- **Manual**: Run `yarn validate:branch` to check current branch

**Rules:**

- Format: `type/description`
- Types: `feat`, `fix`, `hotfix`, `chore`, `docs`, `refactor`, `test`, `perf`
- Description: lowercase letters, numbers, and hyphens only
- Duration: Keep short-lived (1-3 days max)

## 📝 Commit Format (Required)

We use **Conventional Commits** validated by Husky:

```bash
# ✅ Correct format
feat: add TypeScript template support
fix: resolve CLI initialization error
docs: update installation guide
chore: update eslint configuration
perf: optimize template download
refactor: improve validation logic
test: add CLI integration tests
hotfix: patch critical security vulnerability

# With scope (optional)
feat(cli): add interactive template selection
fix(validation): resolve input sanitization issue
docs(api): update endpoint documentation

# Breaking changes
feat!: redesign CLI interface
feat(api)!: change authentication flow

BREAKING CHANGE: API now requires authentication tokens

# ❌ Incorrect (Husky will reject these)
add new feature                    # Missing type:
Fix Bug                           # Wrong case
feat:add user auth                # Missing space after :
feature: add login                # Wrong type (should be feat:)
```

**Validation:**

- **Automatic**: Husky validates on every commit
- **Manual**: `yarn validate:commits` or `yarn commit` (interactive)

## 🎯 Automatic Releases

Commits trigger automatic releases:

| Commit Type                             | Version Bump   | Example       |
| --------------------------------------- | -------------- | ------------- |
| `feat:`                                 | **MINOR**      | 1.0.0 → 1.1.0 |
| `fix:`, `perf:`, `hotfix:`              | **PATCH**      | 1.0.0 → 1.0.1 |
| `feat!:`, `BREAKING CHANGE:`            | **MAJOR**      | 1.0.0 → 2.0.0 |
| `docs:`, `chore:`, `test:`, `refactor:` | **NO RELEASE** | -             |

## 🔄 Daily Workflow

```bash
# 1. Short branch for feature
git checkout -b feature/improve-error-messages
git commit -m "feat: improve CLI error display"
git push

# 2. Quick PR → review → merge
# 3. Merge to main → automatic semantic release (tags, CHANGELOG, GitHub releases)
# 4. Delete branch
```

## 📋 Breaking Changes

```bash
# Option 1: With !
git commit -m "feat!: redesign CLI interface"

# Option 2: With footer
git commit -m "feat: change argument structure

BREAKING CHANGE: --name flag is now --project-name"
```

## ✅ Commands

```bash
# Test commit format locally
yarn release:dry

# Manual release (if needed)
yarn release
```

## 🚨 Rules

1. **Maximum 3 days** per branch
2. **Conventional commits** required (Husky validates)
3. **Frequent merge** to main
4. **Delete branch** after merge
5. **No long-lived branches** except main
