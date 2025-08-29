module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': [() => 'npx tsc --noEmit --skipLibCheck'],

  // Format and lint TypeScript, JavaScript and config files
  '**/*.(ts|tsx|js|mjs|cjs)': (filenames) => [
    `npx prettier --write ${filenames.join(' ')}`,
    `npx eslint --fix --max-warnings 0 ${filenames.join(' ')}`,
  ],

  // Format and lint CSS/SCSS files
  '**/*.(css|scss)': (filenames) => [
    `npx prettier --write ${filenames.join(' ')}`,
    `npx stylelint --fix ${filenames.join(' ')}`,
  ],

  // Format documentation and config files
  '**/*.(md|json|yml|yaml)': (filenames) => [`npx prettier --write ${filenames.join(' ')}`],
};
