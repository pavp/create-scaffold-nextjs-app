module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['ui', 'api', 'auth', 'components', 'pages', 'hooks', 'utils', 'store', 'styles', 'config'],
    ],
    'subject-max-length': [2, 'always', 72],
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'perf', 'refactor', 'test', 'hotfix']],
  },
};
