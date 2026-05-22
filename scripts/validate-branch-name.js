#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Branch name validation script
 * Can be used in various contexts: Git hooks, CI/CD, local scripts
 */

const { execSync } = require('child_process');

const VALID_TYPES = ['feat', 'fix', 'hotfix', 'chore', 'docs', 'refactor', 'test', 'perf'];
const BRANCH_PATTERN = /^(feat|fix|hotfix|chore|docs|refactor|test|perf)\/[a-z0-9\-]+$/;

/**
 * Get current branch name
 * @param {string} [branchName] - Optional branch name to validate (for testing)
 * @returns {string} Branch name
 */
function getCurrentBranchName(branchName) {
  if (branchName) return branchName;

  try {
    return execSync('git symbolic-ref --short HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('❌ Could not get current branch name');
    process.exit(1);
  }
}

/**
 * Validate branch name format
 * @param {string} branchName - Branch name to validate
 * @returns {boolean} Whether the branch name is valid
 */
function validateBranchName(branchName) {
  // Skip validation for main branch
  if (branchName === 'main') {
    console.log('ℹ️  Main branch - skipping validation');

    return true;
  }

  // Check pattern
  if (BRANCH_PATTERN.test(branchName)) {
    console.log(`✅ Branch name is valid: ${branchName}`);

    return true;
  }

  // Show detailed error message
  console.log('');
  console.log(`❌ Invalid branch name: ${branchName}`);
  console.log('');
  console.log('📋 Branch naming requirements:');
  console.log('  Format: type/description');
  console.log(`  Types: ${VALID_TYPES.join(', ')}`);
  console.log('  Description: lowercase letters, numbers, and hyphens only');
  console.log('');
  console.log('✅ Valid examples:');
  console.log('  • feat/add-user-authentication');
  console.log('  • fix/resolve-login-bug');
  console.log('  • docs/update-readme');
  console.log('  • chore/update-dependencies');
  console.log('');
  console.log('💡 To fix: rename your branch using:');
  console.log(`   git branch -m ${branchName} type/new-description`);
  console.log('');

  return false;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const branchName = getCurrentBranchName(args[0]);

  const isValid = validateBranchName(branchName);

  if (!isValid) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateBranchName,
  getCurrentBranchName,
  VALID_TYPES,
  BRANCH_PATTERN,
};
