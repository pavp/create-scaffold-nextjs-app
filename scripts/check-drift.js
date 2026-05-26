#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcPkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const templatePkg = JSON.parse(fs.readFileSync(path.join(root, 'template', 'package.json'), 'utf8'));

// CLI-only deps: intentionally absent from template/package.json
const IGNORE_SRC_ONLY = ['@semantic-release/changelog', '@semantic-release/git', 'semantic-release'];

let driftFound = false;

function checkDeps(label, srcDeps = {}, templateDeps = {}) {
  const srcKeys = Object.keys(srcDeps).sort();
  const templateKeys = Object.keys(templateDeps).sort();

  const onlyInSrc = srcKeys.filter((k) => !templateDeps[k] && !IGNORE_SRC_ONLY.includes(k));
  const onlyInTemplate = templateKeys.filter((k) => !srcDeps[k]);
  const versionMismatch = srcKeys.filter((k) => templateDeps[k] && templateDeps[k] !== srcDeps[k]);

  if (onlyInSrc.length || onlyInTemplate.length || versionMismatch.length) {
    driftFound = true;
    console.error(`\n[drift] ${label}:`);
    onlyInSrc.forEach((k) => console.error(`  + src only:      ${k}@${srcDeps[k]}`));
    onlyInTemplate.forEach((k) => console.error(`  + template only: ${k}@${templateDeps[k]}`));
    versionMismatch.forEach((k) =>
      console.error(`  ~ version diff:  ${k}  src=${srcDeps[k]}  template=${templateDeps[k]}`),
    );
  }
}

checkDeps('dependencies', srcPkg.dependencies, templatePkg.dependencies);
checkDeps('devDependencies', srcPkg.devDependencies, templatePkg.devDependencies);

if (driftFound) {
  console.error('\nDrift detected. Sync package.json and template/package.json.\n');
  process.exit(1);
} else {
  console.log('No drift detected between package.json and template/package.json.');
}
