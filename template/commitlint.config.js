module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Scopes based on Clean Architecture structure
    'scope-enum': [
      2,
      'always',
      [
        // Clean Architecture layers
        'modules',
        'core',
        'shared',
        'types',
        // UI & Components
        'ui',
        'components',
        // API & Data
        'api',
        'actions',
        'auth',
        // App structure
        'app',
        'navigation',
        'i18n',
        'hooks',
        // Styling & Design Tokens
        'styles',
        'tokens',
        'design-tokens',
        // Infrastructure
        'config',
        'build',
        'test',
        'lint',
        // Dependencies & maintenance
        'dependencies',
        'deps',
      ],
    ],
    'subject-max-length': [2, 'always', 72],
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'perf', 'refactor', 'test', 'hotfix']],
  },
};
