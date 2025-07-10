module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['cli', 'template', 'nextjs', 'react', 'styles', 'scripts', 'config', 'dependencies', 'husky', 'lint'],
    ],
    'subject-max-length': [2, 'always', 72],
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'perf', 'refactor', 'test', 'hotfix']],
  },
};
