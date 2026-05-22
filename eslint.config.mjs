/* eslint-disable max-len */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { globalIgnores } from 'eslint/config';
import checkFile from 'eslint-plugin-check-file';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});

export default tseslint.config([
  globalIgnores([
    '**/.next',
    '**/.cache',
    '**/package-lock.json',
    '**/public',
    '**/node_modules',
    '**/next-env.d.ts',
    '**/next.config.ts',
    '**/yarn.lock',
    '**/dist',
    '**/build',
    '**/out',
    '**/coverage',
    '**/*.log',
    '**/.env*',
    '**/.vscode',
    '**/.idea',
    '**/.DS_Store',
    '**/Thumbs.db',
    '**/*.tsbuildinfo',
  ]),
  {
    extends: [compat.extends('next', 'next/core-web-vitals', 'prettier')],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'check-file': checkFile,
      '@typescript-eslint': typescriptEslint,
      prettier,
      '@stylistic': stylistic,
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
      'no-empty': 'error',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      quotes: [
        2,
        'single',
        {
          avoidEscape: true,
        },
      ],
      'max-len': [
        2,
        {
          code: 120,
          ignoreUrls: true,
          ignoreTrailingComments: true,
          ignorePattern: '^(import|export) \\{(.*?)\\}',
        },
      ],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['return', 'export'],
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'max-params': ['error', 3],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      'react/self-closing-comp': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mui/material', '@mui/material/*', 'next/link'],
              message: 'Please import from `@/ui` instead.',
            },
            {
              group: ['@testing-library/react', 'react-dom'],
              message: 'Please import from `@test/utils/test-utils` instead.',
            },
          ],
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/(?!.*__mocks__/).*': 'NEXT_JS_APP_ROUTER_CASE',
          'test/(?!.*__mocks__/).*': 'KEBAB_CASE',
        },
      ],
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{js,jsx,ts,tsx}': 'KEBAB_CASE',
          '**/test/**': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
          errorMessage:
            'The file "{{ target }}" does not match file naming convention defined("{{ pattern }}") for this project, see rules-conventions.md for details',
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array-simple',
          readonly: 'array-simple',
        },
      ],
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_.*?$',
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^@?\\w'],
            ['^(@|components)(/.*|$)'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.?(css)$'],
          ],
        },
      ],
    },
  },
  {
    files: ['src/ui/**/*', 'test/**/*'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['**/index.ts', '**/index.js'],
    rules: {
      'padding-line-between-statements': 'off',
    },
  },
  {
    files: ['**/__mocks__/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'check-file/filename-naming-convention': 'off',
    },
  },
]);
