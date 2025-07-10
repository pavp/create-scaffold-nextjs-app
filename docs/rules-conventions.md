# Rules and Conventions

In order to enforce a consistent code style and avoid common issues in the codebase, we have a set of rules and conventions that we follow and enforce through the starter.

## Typescript

This starter uses TypeScript to provide type safety and avoid common bugs in the codebase. The project configuration is based on Next config with some updates to support absolute imports.

## Naming

We follow kabab-case for naming files and folders as we think it’s the most readable, maintaining clean and consistent way to name files and folders in large projects with NextJS.

Example of kabab-case naming: `my-component.tsx`

For naming variables, functions, classes, interfaces, and enums, we follow camelCase as it’s the most common way to name variables in the React community. It is enforced by the linter, as you cannot create a function component without using camelCase.

## Linting

Using a linter is a must in any JavaScript project. For starters, we are using ESLint with prettier with the next/core-web-vitals config and some custom rules to ensure that we are following the rules and conventions related to file naming, TypeScript types, import order and more.

Please before start work, install VSCode extension [Prettier ESlint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint).

## Husky

Automatically lint your commit messages, code, and run tests upon committing or pushing.

We have implemented it only for commits, following the defined ESLint and Prettier rules.

Could be skipped if desired (just exceptionally) by adding --no-verify to your commit. (git commit -m 'commit message' --no-verify)
