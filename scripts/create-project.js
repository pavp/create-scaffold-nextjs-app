#!/usr/bin/env node
/* eslint-disable no-console */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to prompt user input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Helper function to validate project name
function validateProjectName(name) {
  const regex = /^[a-z0-9-]+$/;

  return regex.test(name) && name.length > 0;
}

// Helper function to validate package name
function validatePackageName(name) {
  const regex = /^[a-z0-9-]+$/;

  return regex.test(name) && name.length > 0;
}

// Helper function to copy directory recursively
function copyDirectory(src, dest, excludeDirs = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    if (excludeDirs.includes(item)) {
      continue;
    }

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath, excludeDirs);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper function to replace placeholders in file content
function replaceInFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace placeholders
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(placeholder, 'g');

      content = content.replace(regex, replacement);
    }

    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.log(`${colors.yellow}Warning: Could not process file ${filePath}${colors.reset}`);
  }
}

// Helper function to recursively find and replace in files
function replaceInDirectory(dir, replacements, fileExtensions = ['.json', '.md', '.tsx', '.ts', '.js', '.html']) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules and .git directories
      if (item !== 'node_modules' && item !== '.git' && item !== 'coverage') {
        replaceInDirectory(fullPath, replacements, fileExtensions);
      }
    } else {
      const ext = path.extname(item);

      if (fileExtensions.includes(ext)) {
        replaceInFile(fullPath, replacements);
      }
    }
  }
}

// Main CLI function
async function main() {
  console.log(`${colors.bright}${colors.cyan}🚀 Nextlane Project Creator${colors.reset}`);
  console.log(`${colors.blue}Welcome to the Nextlane shared template CLI!${colors.reset}\n`);

  try {
    // Get project configuration from user
    const projectName = await prompt(`${colors.green}Project name (kebab-case):${colors.reset} `);

    if (!validateProjectName(projectName)) {
      console.log(
        `${colors.red}❌ Invalid project name. Use kebab-case ` +
          `(lowercase letters, numbers, and hyphens only).${colors.reset}`,
      );
      process.exit(1);
    }

    const packageName =
      (await prompt(`${colors.green}Package name (default: ${projectName}):${colors.reset} `)) || projectName;

    if (!validatePackageName(packageName)) {
      console.log(
        `${colors.red}❌ Invalid package name. Use kebab-case ` +
          `(lowercase letters, numbers, and hyphens only).${colors.reset}`,
      );
      process.exit(1);
    }

    const description = await prompt(`${colors.green}Project description:${colors.reset} `);

    if (!description) {
      console.log(`${colors.red}❌ Project description is required.${colors.reset}`);
      process.exit(1);
    }

    const targetDir =
      (await prompt(`${colors.green}Target directory (default: ./${projectName}):${colors.reset} `)) ||
      `./${projectName}`;

    rl.close();

    // Check if target directory already exists
    if (fs.existsSync(targetDir)) {
      console.log(`${colors.red}❌ Directory ${targetDir} already exists.${colors.reset}`);
      process.exit(1);
    }

    console.log(`\n${colors.bright}${colors.blue}📋 Configuration Summary:${colors.reset}`);
    console.log(`${colors.cyan}Project Name:${colors.reset} ${projectName}`);
    console.log(`${colors.cyan}Package Name:${colors.reset} ${packageName}`);
    console.log(`${colors.cyan}Description:${colors.reset} ${description}`);
    console.log(`${colors.cyan}Target Directory:${colors.reset} ${targetDir}`);

    console.log(`\n${colors.bright}${colors.blue}🔄 Creating project...${colors.reset}`);

    // Copy template files
    const templateDir = path.join(__dirname, '..');
    const excludeDirs = ['node_modules', '.git', 'coverage'];

    console.log(`${colors.yellow}📁 Copying template files...${colors.reset}`);
    copyDirectory(templateDir, targetDir, excludeDirs);

    // Remove CLI-specific files
    const cliSpecificFiles = [
      path.join(targetDir, 'docs', 'contributing.md'),
      path.join(targetDir, 'bin'),
      path.join(targetDir, 'test-cli-automated.js'),
      path.join(targetDir, 'test-interactive.js'),
      path.join(targetDir, 'test-simple.js'),
      path.join(targetDir, 'scripts', 'create-project.js'),
      path.join(targetDir, '.github', 'dependabot.yml'),
      path.join(targetDir, '.github', 'workflows', 'semantic-release.yml'),
      path.join(targetDir, '.github', 'workflows', 'manual-dependabot-trigger.yml'),
    ];

    cliSpecificFiles.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        if (fs.statSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      }
    });

    // Define replacements
    const replacements = {
      'swat-frontend': packageName,
      SWAT: projectName.toUpperCase(),
      'shared-create-nextlane-app': projectName,
      'shared-create-nextlane-app is the official CLI tool to bootstrap a modern frontend application': description,
      '0\\.1\\.0': '1.0.0',
    };

    console.log(`${colors.yellow}🔄 Replacing placeholders...${colors.reset}`);
    replaceInDirectory(targetDir, replacements);

    // Initialize git repository
    console.log(`${colors.yellow}🔧 Initializing git repository...${colors.reset}`);
    try {
      execSync('git init', { cwd: targetDir, stdio: 'ignore' });
      console.log(`${colors.green}✅ Git repository initialized${colors.reset}`);
    } catch (error) {
      console.log(`${colors.yellow}⚠️ Could not initialize git repository${colors.reset}`);
    }

    // Success message
    console.log(`\n${colors.bright}${colors.green}🎉 Project created successfully!${colors.reset}`);
    console.log(`\n${colors.bright}${colors.blue}Next steps:${colors.reset}`);
    console.log(`${colors.cyan}1.${colors.reset} cd ${targetDir}`);
    console.log(`${colors.cyan}2.${colors.reset} yarn install`);
    console.log(`${colors.cyan}3.${colors.reset} yarn dev`);
    console.log(`\n${colors.bright}${colors.blue}Happy coding! 🚀${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Handle process interruption
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}👋 Goodbye!${colors.reset}`);
  process.exit(0);
});

// Run the CLI
main();
