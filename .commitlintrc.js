module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(commit) => commit.includes('[skip ci]'), (commit) => commit.includes('chore(release):')],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva funcionalidad
        'fix', // Bug fix
        'docs', // Documentación
        'chore', // Mantenimiento (deps, CI, etc.)
        'test', // Tests
        'refactor', // Refactoring
        'perf', // Performance
        'hotfix', // Critical fixes
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 72],
    'subject-min-length': [2, 'always', 3],
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
  },
};
