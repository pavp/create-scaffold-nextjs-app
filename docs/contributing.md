# Contributing Guide

## 🌳 Workflow Overview

This project uses **trunk-based development** with collaborative workflow.

## 🌿 Branch Types

```bash
# ✅ Use these (short branches, 1-3 days max)
feature/add-new-component
fix/validation-error
hotfix/critical-security-patch
chore/update-dependencies
docs/improve-readme
```

## 📝 Commit Format (Required)

We use **Conventional Commits** validated by Husky:

```bash
# ✅ Correct
feat: add TypeScript template support
fix: resolve CLI initialization error
docs: update installation guide
chore: update eslint configuration
perf: optimize template download
refactor: improve validation logic
test: add CLI integration tests
hotfix: patch critical security vulnerability

# ❌ Incorrect (Husky will reject it)
add new feature
fix bug
update docs
```

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
