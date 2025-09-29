#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

/**
 * Sync dependencies from root package.json to template/package.json
 * Only updates dependencies that exist in both files
 */
function syncTemplateDependencies() {
  try {
    console.log(`${colors.bright}${colors.blue}🔄 Syncing template dependencies...${colors.reset}`);

    // Read root package.json
    const rootPackagePath = path.join(process.cwd(), 'package.json');
    const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));

    // Read template package.json
    const templatePackagePath = path.join(process.cwd(), 'template', 'package.json');
    const templatePackage = JSON.parse(fs.readFileSync(templatePackagePath, 'utf8'));

    let hasChanges = false;
    const changes = [];

    // Sync dependencies
    if (rootPackage.dependencies && templatePackage.dependencies) {
      for (const [depName, rootVersion] of Object.entries(rootPackage.dependencies)) {
        if (templatePackage.dependencies[depName]) {
          const templateVersion = templatePackage.dependencies[depName];

          if (templateVersion !== rootVersion) {
            templatePackage.dependencies[depName] = rootVersion;
            changes.push(`  ${colors.cyan}${depName}${colors.reset}: ${templateVersion} → ${rootVersion}`);
            hasChanges = true;
          }
        }
      }
    }

    // Sync devDependencies
    if (rootPackage.devDependencies && templatePackage.devDependencies) {
      for (const [depName, rootVersion] of Object.entries(rootPackage.devDependencies)) {
        if (templatePackage.devDependencies[depName]) {
          const templateVersion = templatePackage.devDependencies[depName];

          if (templateVersion !== rootVersion) {
            templatePackage.devDependencies[depName] = rootVersion;
            changes.push(`  ${colors.cyan}${depName}${colors.reset} (dev): ${templateVersion} → ${rootVersion}`);
            hasChanges = true;
          }
        }
      }
    }

    if (hasChanges) {
      // Write updated template package.json
      fs.writeFileSync(templatePackagePath, JSON.stringify(templatePackage, null, 2) + '\n', 'utf8');

      console.log(`${colors.green}✅ Template dependencies synced:${colors.reset}`);
      changes.forEach((change) => console.log(change));
    } else {
      console.log(`${colors.yellow}ℹ️  No template dependencies need syncing${colors.reset}`);
    }

    return hasChanges;
  } catch (error) {
    console.error(`${colors.red}❌ Error syncing dependencies: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the sync if this script is executed directly
if (require.main === module) {
  const hasChanges = syncTemplateDependencies();

  console.log(`${colors.bright}${colors.green}🎉 Sync completed!${colors.reset}`);
  process.exit(hasChanges ? 0 : 0);
}

module.exports = { syncTemplateDependencies };
