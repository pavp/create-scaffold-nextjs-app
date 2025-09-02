module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Scopes based on actual project structure
    'scope-enum': [
      2,
      'always',
      [
        // CLI specific
        'cli',
        'bin',
        'scripts',
        // Project areas
        'template',
        'docs',
        'test',
        // Infrastructure
        'config',
        'husky',
        'lint',
        'ci',
        'build',
        // Dependencies & maintenance
        'dependencies',
        'deps',
        // Style Dictionary & Design Tokens
        'styles',
        'tokens',
        'design-tokens',
        // Architecture (when changes affect multiple areas)
        'core',
        'shared',
        'types',
      ],
    ],
    'subject-max-length': [2, 'always', 72],
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'perf', 'refactor', 'test', 'hotfix']],
  },
};
