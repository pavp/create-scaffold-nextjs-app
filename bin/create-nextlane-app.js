#!/usr/bin/env node
/* eslint-disable no-console */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const { pipeline } = require('stream');
const { promisify } = require('util');

const streamPipeline = promisify(pipeline);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// GitHub repository configuration
const GITHUB_REPO = 'nxl-engineering/shared-create-nextlane-app';
const GITHUB_BRANCH = 'main';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}`;
const GITHUB_DOWNLOAD_URL = `https://github.com/${GITHUB_REPO}/archive/${GITHUB_BRANCH}.zip`;

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

  return regex.test(name) && name.length > 0 && !name.startsWith('-') && !name.endsWith('-');
}

// Helper function to validate package name
function validatePackageName(name) {
  const regex = /^[a-z0-9-]+$/;

  return regex.test(name) && name.length > 0 && !name.startsWith('-') && !name.endsWith('-');
}

// Helper function to check if we're running locally (for testing)
function isLocalDevelopment() {
  return fs.existsSync(path.join(__dirname, '..', 'src')) && fs.existsSync(path.join(__dirname, '..', 'package.json'));
}

// Helper function to download and extract GitHub repository
async function downloadTemplate(targetDir, projectData = {}) {
  const tempDir = path.join(require('os').tmpdir(), `nextlane-template-${Date.now()}`);
  const zipPath = path.join(tempDir, 'template.zip');

  try {
    // Create temp directory
    fs.mkdirSync(tempDir, { recursive: true });

    console.log(`${colors.yellow}📡 Downloading template from GitHub...${colors.reset}`);

    // Download zip file
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(zipPath);

      https
        .get(GITHUB_DOWNLOAD_URL, (response) => {
          if (response.statusCode === 302 || response.statusCode === 301) {
            // Follow redirect
            https
              .get(response.headers.location, (redirectResponse) => {
                redirectResponse.pipe(file);
                file.on('finish', () => {
                  file.close();
                  resolve();
                });
              })
              .on('error', reject);
          } else {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          }
        })
        .on('error', reject);
    });

    console.log(`${colors.yellow}📦 Extracting template...${colors.reset}`);

    // Extract zip file
    try {
      execSync(`cd "${tempDir}" && unzip -q template.zip`, { stdio: 'ignore' });
    } catch (error) {
      // Try with different unzip command
      try {
        execSync(`cd "${tempDir}" && tar -xf template.zip`, { stdio: 'ignore' });
      } catch (error2) {
        throw new Error('Failed to extract template. Please ensure unzip or tar is installed.');
      }
    }

    // Find extracted directory
    const extractedDirs = fs.readdirSync(tempDir).filter((item) => {
      return fs.statSync(path.join(tempDir, item)).isDirectory() && item !== '.';
    });

    if (extractedDirs.length === 0) {
      throw new Error('No extracted directory found');
    }

    const extractedDir = path.join(tempDir, extractedDirs[0]);

    // Copy template files
    copyDirectory(extractedDir, targetDir, {
      excludeDirs: [
        'node_modules',
        '.git',
        'coverage',
        'scripts',
        'bin',
        'devops',
        '.github/workflows',
        'semantic-release.yml',
        'validate.yml',
        'Dockerfile',
        '.dockerignore',
        'docs/contributing.md',
        'gitignore-template',
      ],
    });

    // Ensure .gitignore is copied by using gitignore-template
    const gitignoreDestination = path.join(targetDir, '.gitignore');

    if (!fs.existsSync(gitignoreDestination)) {
      console.log(`${colors.yellow}📋 Copying .gitignore from template...${colors.reset}`);
      const gitignoreTemplate = path.join(extractedDir, 'gitignore-template');

      if (fs.existsSync(gitignoreTemplate)) {
        try {
          fs.copyFileSync(gitignoreTemplate, gitignoreDestination);
          console.log(`${colors.green}✅ .gitignore copied successfully${colors.reset}`);
        } catch (error) {
          console.log(`${colors.red}❌ Error copying .gitignore: ${error.message}${colors.reset}`);
        }
      } else {
        console.log(`${colors.yellow}⚠️ gitignore-template not found${colors.reset}`);
      }
    }

    // Copy template files with placeholders (overwrite existing files)
    const templateFilesDir = path.join(extractedDir, 'template');

    if (fs.existsSync(templateFilesDir)) {
      console.log(`${colors.yellow}📄 Copying template files...${colors.reset}`);

      const templateFiles = fs.readdirSync(templateFilesDir);

      for (const file of templateFiles) {
        const srcPath = path.join(templateFilesDir, file);
        let destPath;

        // Handle specific file destinations
        if (file === 'config.ts') {
          destPath = path.join(targetDir, 'src', file);
        } else {
          destPath = path.join(targetDir, file);
        }

        try {
          const srcStat = fs.statSync(srcPath);

          if (srcStat.isDirectory()) {
            copyDirectory(srcPath, destPath);
            console.log(`${colors.green}✅ ${file}/ copied from template${colors.reset}`);
          } else {
            // Ensure destination directory exists
            const destDir = path.dirname(destPath);

            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true });
            }

            fs.copyFileSync(srcPath, destPath);
            console.log(`${colors.green}✅ ${file} copied from template${colors.reset}`);

            // Apply replacements to template files immediately after copying
            if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.md')) {
              try {
                let content = fs.readFileSync(destPath, 'utf8');
                const replacements = {
                  '{{PACKAGE_NAME}}': projectData.packageName || 'unknown',
                  '{{PROJECT_NAME}}': projectData.packageName || 'unknown',
                  '{{PROJECT_DESCRIPTION}}': projectData.description || 'Unknown description',
                };

                for (const [placeholder, replacement] of Object.entries(replacements)) {
                  const regex = new RegExp(placeholder, 'g');

                  content = content.replace(regex, replacement);
                }

                fs.writeFileSync(destPath, content, 'utf8');
                console.log(`${colors.green}✅ ${file} placeholders replaced${colors.reset}`);
              } catch (error) {
                console.log(`${colors.yellow}Warning: Could not process placeholders in ${file}${colors.reset}`);
              }
            }
          }
        } catch (error) {
          console.log(`${colors.red}❌ Failed to copy ${file}: ${error.message}${colors.reset}`);
          throw error;
        }
      }
    }

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (error) {
    // Clean up on error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    throw error;
  }
}

// Helper function to copy template from local directory (for testing)
function copyLocalTemplate(targetDir, projectData = {}) {
  const templateDir = path.join(__dirname, '..');

  // Always exclude these directories and CLI-related files
  const baseExcludes = [
    'node_modules',
    'scripts',
    'bin',
    'template',
    'tmp',
    'test-cli-project',
    '.git',
    'devops',
    '.github/workflows',
    'semantic-release.yml',
    'validate.yml',
    'Dockerfile',
    '.dockerignore',
    'docs/contributing.md',
    'gitignore-template',
  ];

  // Use only base excludes (gitignore-template handles .gitignore copying)
  const excludeDirs = baseExcludes;

  console.log(`${colors.yellow}📁 Copying local template...${colors.reset}`);
  console.log(`${colors.yellow}📋 Excluding: ${excludeDirs.join(', ')}${colors.reset}`);

  // Ensure target directory exists before copying
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  copyDirectory(templateDir, targetDir, { excludeDirs });

  // Ensure .gitignore is copied by using gitignore-template
  const gitignoreDestination = path.join(targetDir, '.gitignore');

  if (!fs.existsSync(gitignoreDestination)) {
    console.log(`${colors.yellow}📋 Copying .gitignore from template...${colors.reset}`);
    const gitignoreTemplate = path.join(templateDir, 'gitignore-template');

    if (fs.existsSync(gitignoreTemplate)) {
      try {
        fs.copyFileSync(gitignoreTemplate, gitignoreDestination);
        console.log(`${colors.green}✅ .gitignore copied successfully${colors.reset}`);
      } catch (error) {
        console.log(`${colors.red}❌ Error copying .gitignore: ${error.message}${colors.reset}`);
      }
    } else {
      console.log(`${colors.yellow}⚠️ gitignore-template not found${colors.reset}`);
    }
  }

  // Copy template files with placeholders (overwrite existing files)
  const templateFilesDir = path.join(__dirname, '..', 'template');

  if (fs.existsSync(templateFilesDir)) {
    console.log(`${colors.yellow}📄 Copying template files...${colors.reset}`);

    const templateFiles = fs.readdirSync(templateFilesDir);

    for (const file of templateFiles) {
      const srcPath = path.join(templateFilesDir, file);
      let destPath;

      // Handle specific file destinations
      if (file === 'config.ts') {
        destPath = path.join(targetDir, 'src', file);
      } else if (file === '.env.template') {
        // Create .env.local from .env.template
        destPath = path.join(targetDir, '.env.local');
      } else {
        destPath = path.join(targetDir, file);
      }

      try {
        const srcStat = fs.statSync(srcPath);

        if (srcStat.isDirectory()) {
          copyDirectory(srcPath, destPath);
          console.log(`${colors.green}✅ ${file}/ copied from template${colors.reset}`);
        } else {
          // Ensure destination directory exists
          const destDir = path.dirname(destPath);

          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }

          fs.copyFileSync(srcPath, destPath);
          if (file === '.env.template') {
            console.log(`${colors.green}✅ .env.local created from template${colors.reset}`);
          } else {
            console.log(`${colors.green}✅ ${file} copied from template${colors.reset}`);
          }

          // Apply replacements to template files immediately after copying
          if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.md')) {
            try {
              let content = fs.readFileSync(destPath, 'utf8');
              const replacements = {
                '{{PACKAGE_NAME}}': projectData.packageName || 'unknown',
                '{{PROJECT_NAME}}': projectData.packageName || 'unknown',
                '{{PROJECT_DESCRIPTION}}': projectData.description || 'Unknown description',
              };

              for (const [placeholder, replacement] of Object.entries(replacements)) {
                const regex = new RegExp(placeholder, 'g');

                content = content.replace(regex, replacement);
              }

              fs.writeFileSync(destPath, content, 'utf8');
              console.log(`${colors.green}✅ ${file} placeholders replaced${colors.reset}`);
            } catch (error) {
              console.log(`${colors.yellow}Warning: Could not process placeholders in ${file}${colors.reset}`);
            }
          }
        }
      } catch (error) {
        console.log(`${colors.red}❌ Failed to copy ${file}: ${error.message}${colors.reset}`);
        throw error;
      }
    }
  }
}

// Helper function to check if file/directory should be excluded
function shouldExclude(itemName, excludeDirs = []) {
  // Never exclude gitignore-template - it's needed for .gitignore creation
  if (itemName === 'gitignore-template') {
    return false;
  }

  // CLI-related files and directories to exclude
  const cliRelatedPatterns = [
    'test-cli-automated.js',
    'test-interactive.js',
    'test-simple.js',
    'test-interactive-example.md',
  ];

  // Check if it's in exclude directories
  if (excludeDirs.includes(itemName)) {
    return true;
  }

  // Check if it's a CLI-related file
  if (cliRelatedPatterns.includes(itemName)) {
    return true;
  }

  // Check for CLI-related patterns
  if (itemName.startsWith('test-cli') || itemName.includes('cli-deployment') || itemName.startsWith('cli-')) {
    return true;
  }

  return false;
}

// Helper function to copy directory recursively
function copyDirectory(src, dest, options = {}) {
  const { excludeDirs = [], basePath = '' } = options;
  // Safety check to prevent infinite loops
  const srcResolved = path.resolve(src);
  const destResolved = path.resolve(dest);

  // Only skip if destination is directly problematic (same directory or immediate child without tmp)
  if (destResolved === srcResolved || (destResolved.startsWith(srcResolved) && !destResolved.includes('/tmp/'))) {
    console.log(`${colors.yellow}⚠️ Skipping potentially problematic copy: ${dest}${colors.reset}`);

    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const relativePath = basePath ? path.join(basePath, item) : item;

    // Check if this item should be excluded
    if (shouldExclude(item, excludeDirs) || excludeDirs.includes(relativePath)) {
      continue;
    }

    // Additional safety check for each item
    const srcPathResolved = path.resolve(srcPath);
    const destPathResolved = path.resolve(destPath);

    if (destPathResolved.startsWith(srcPathResolved) || srcPathResolved === destPathResolved) {
      continue;
    }

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath, { excludeDirs, basePath: relativePath });
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
      // Skip problematic directories that could cause infinite loops
      if (
        item !== 'node_modules' &&
        item !== '.git' &&
        item !== 'coverage' &&
        item !== 'tmp' &&
        item !== '.next' &&
        !fullPath.includes('/tmp/')
      ) {
        replaceInDirectory(fullPath, replacements, fileExtensions);
      }
    } else {
      // Skip CLI-related files during replacement too
      if (!shouldExclude(item, [])) {
        const ext = path.extname(item);

        if (fileExtensions.includes(ext)) {
          replaceInFile(fullPath, replacements);
        }
      }
    }
  }
}

// Helper function to check if directory exists and is empty
function isDirectoryEmpty(dir) {
  if (!fs.existsSync(dir)) {
    return true;
  }
  const items = fs.readdirSync(dir);

  return items.length === 0;
}

// Main CLI function
async function main() {
  console.log(`${colors.bright}${colors.cyan}🚀 Create Nextlane App${colors.reset}`);
  console.log(`${colors.blue}Bootstrap a modern frontend application with Nextlane's template${colors.reset}\n`);

  const isLocal = isLocalDevelopment();

  if (isLocal) {
    console.log(`${colors.magenta}🔧 Running in local development mode${colors.reset}\n`);
  }

  try {
    // Get project configuration from user
    const projectName = await prompt(`${colors.green}Project name (kebab-case):${colors.reset} `);

    if (!projectName) {
      console.log(`${colors.red}❌ Project name is required.${colors.reset}`);
      process.exit(1);
    }

    if (!validateProjectName(projectName)) {
      console.log(
        `${colors.red}❌ Invalid project name. Use kebab-case ` +
          `(lowercase letters, numbers, and hyphens only).${colors.reset}`,
      );
      console.log(`${colors.yellow}Examples: my-app, user-dashboard, admin-panel${colors.reset}`);
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
      rl.close();
      process.exit(1);
    }

    const targetDirInput =
      (await prompt(
        `${colors.green}Target directory (default: ./${projectName}, use "." for current):${colors.reset} `,
      )) || `./${projectName}`;

    // Convert to absolute path to avoid issues
    const targetDir = path.resolve(targetDirInput);

    // Detect if user wants to use current directory
    const useCurrentDir = path.resolve(targetDirInput) === process.cwd();

    if (useCurrentDir) {
      console.log(`\n${colors.cyan}📍 Using current directory for project initialization${colors.reset}`);
      console.log(`${colors.yellow}📁 Location: ${targetDir}${colors.reset}`);
    }

    // Check if target directory already exists and is not empty
    if (!isDirectoryEmpty(targetDir)) {
      if (useCurrentDir) {
        console.log(`\n${colors.yellow}⚠️ Current directory is not empty${colors.reset}`);
        console.log(`${colors.yellow}📂 Found existing files in: ${targetDir}${colors.reset}`);

        const existingFiles = fs.readdirSync(targetDir);
        const visibleFiles = existingFiles.filter((file) => !file.startsWith('.')).slice(0, 5);

        console.log(
          `${colors.yellow}📄 Files: ${visibleFiles.join(', ')}${existingFiles.length > 5 ? '...' : ''}${colors.reset}`,
        );

        const confirm = await prompt(`${colors.cyan}Continue and merge with existing files? (y/N):${colors.reset} `);

        if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
          console.log(`${colors.yellow}👋 Operation cancelled${colors.reset}`);
          rl.close();
          process.exit(0);
        }
        console.log(`${colors.green}✅ Proceeding with current directory${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ Directory ${targetDir} already exists and is not empty.${colors.reset}`);
        console.log(`${colors.cyan}💡 Tip: Use "." to initialize in current directory${colors.reset}`);
        rl.close();
        process.exit(1);
      }
    }

    rl.close();

    console.log(`\n${colors.bright}${colors.blue}📋 Configuration Summary:${colors.reset}`);
    console.log(`${colors.cyan}Project Name:${colors.reset} ${projectName}`);
    console.log(`${colors.cyan}Package Name:${colors.reset} ${packageName}`);
    console.log(`${colors.cyan}Description:${colors.reset} ${description}`);
    console.log(`${colors.cyan}Target Directory:${colors.reset} ${targetDir}`);

    console.log(`\n${colors.bright}${colors.blue}🔄 Creating project...${colors.reset}`);

    // Initialize git repository first (only if not already in a git repo)
    console.log(`${colors.yellow}🔧 Initializing git repository...${colors.reset}`);
    const gitPath = path.join(targetDir, '.git');
    const parentGitPath = path.join(path.dirname(targetDir), '.git');

    if (fs.existsSync(gitPath)) {
      console.log(`${colors.green}✅ Git repository already exists${colors.reset}`);
    } else if (fs.existsSync(parentGitPath)) {
      console.log(`${colors.yellow}⚠️ Parent directory is already a git repository${colors.reset}`);
      console.log(`${colors.cyan}💡 Consider creating the project outside the current git repository${colors.reset}`);
    } else {
      try {
        // Ensure target directory exists before git init
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        execSync('git init', { cwd: targetDir, stdio: 'ignore' });
        console.log(`${colors.green}✅ Git repository initialized${colors.reset}`);
      } catch (error) {
        console.log(`${colors.yellow}⚠️ Could not initialize git repository: ${error.message}${colors.reset}`);
      }
    }

    // Copy template files
    if (isLocal) {
      copyLocalTemplate(targetDir, { packageName, projectName, description });
    } else {
      await downloadTemplate(targetDir, { packageName, projectName, description });
    }

    // Define replacements
    const replacements = {
      '{{PACKAGE_NAME}}': packageName,
      '{{PROJECT_NAME}}': packageName,
      '{{PROJECT_DESCRIPTION}}': description,
      'swat-frontend': packageName,
      SWAT: projectName.toUpperCase().replace(/-/g, ' '),
      'shared-create-nextlane-app': projectName,
      'shared-create-nextlane-app is the official CLI tool to bootstrap a modern frontend application': description,
      '0\\.1\\.0': '1.0.0',
    };

    console.log(`${colors.yellow}🔄 Configuring project...${colors.reset}`);
    replaceInDirectory(targetDir, replacements);

    // Read package.json for versions
    const packageJsonPath = path.join(targetDir, 'package.json');
    let versions = {};

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      versions = {
        next: deps.next?.replace('^', '') || 'latest',
        react: deps.react?.replace('^', '') || 'latest',
        mui: deps['@mui/material']?.replace('^', '') || 'latest',
        typescript: deps.typescript?.replace('^', '') || 'latest',
        nextIntl: deps['next-intl']?.replace('^', '') || 'latest',
        eslint: deps.eslint?.replace('^', '') || 'latest',
        prettier: deps.prettier?.replace('^', '') || 'latest',
        jest: deps.jest?.replace('^', '') || 'latest',
        testingLibrary: deps['@testing-library/react']?.replace('^', '') || 'latest',
        reactQuery: deps['@tanstack/react-query']?.replace('^', '') || 'latest',
        zustand: deps.zustand?.replace('^', '') || 'latest',
        sass: deps.sass?.replace('^', '') || 'latest',
        styleDictionary: deps['style-dictionary']?.replace('^', '') || 'latest',
        stylelint: deps.stylelint?.replace('^', '') || 'latest',
        husky: deps.husky?.replace('^', '') || 'latest',
        lintStaged: deps['lint-staged']?.replace('^', '') || 'latest',
      };
    } catch (error) {
      console.log(`${colors.yellow}Warning: Could not read package.json for version info${colors.reset}`);
    }

    // Success message
    if (useCurrentDir) {
      console.log(
        `\n${colors.bright}${colors.green}🎉 Project initialized successfully in current directory!${colors.reset}`,
      );
      console.log(`\n${colors.bright}${colors.blue}Next steps:${colors.reset}`);
      console.log(
        `${colors.cyan}1.${colors.reset} Configure your environment variables in .env.local ` +
          '(already created from template)',
      );
      console.log(`${colors.cyan}2.${colors.reset} Install dependencies (choose your preferred package manager):`);
      console.log(
        `   ${colors.yellow}npm install${colors.reset} | ${colors.yellow}yarn install${colors.reset} | ` +
          `${colors.yellow}pnpm install${colors.reset}`,
      );
      console.log(`${colors.cyan}3.${colors.reset} Start development server:`);
      console.log(
        `   ${colors.yellow}npm run dev${colors.reset} | ${colors.yellow}yarn dev${colors.reset} | ` +
          `${colors.yellow}pnpm dev${colors.reset}`,
      );
    } else {
      console.log(`\n${colors.bright}${colors.green}🎉 Project created successfully!${colors.reset}`);
      console.log(`\n${colors.bright}${colors.blue}Next steps:${colors.reset}`);
      console.log(`${colors.cyan}1.${colors.reset} cd ${path.relative(process.cwd(), targetDir)}`);
      console.log(
        `${colors.cyan}2.${colors.reset} Configure your environment variables in .env.local ` +
          '(already created from template)',
      );
      console.log(`${colors.cyan}3.${colors.reset} Install dependencies (choose your preferred package manager):`);
      console.log(
        `   ${colors.yellow}npm install${colors.reset} | ${colors.yellow}yarn install${colors.reset} | ` +
          `${colors.yellow}pnpm install${colors.reset}`,
      );
      console.log(`${colors.cyan}4.${colors.reset} Start development server:`);
      console.log(
        `   ${colors.yellow}npm run dev${colors.reset} | ${colors.yellow}yarn dev${colors.reset} | ` +
          `${colors.yellow}pnpm dev${colors.reset}`,
      );
    }

    // Features included section
    console.log(`\n${colors.bright}${colors.blue}📦 Features Included:${colors.reset}`);
    console.log(`${colors.green}⚡${colors.reset} Next.js ${versions.next} + React ${versions.react}`);
    console.log(`${colors.green}🎨${colors.reset} Material-UI ${versions.mui} + Design System`);
    console.log(`${colors.green}🔧${colors.reset} TypeScript ${versions.typescript} configured`);
    console.log(`${colors.green}📱${colors.reset} Responsive design`);
    console.log(`${colors.green}🌍${colors.reset} Internationalization (next-intl ${versions.nextIntl})`);
    console.log(
      `${colors.green}🎯${colors.reset} ESLint ${versions.eslint} + Prettier ${versions.prettier} + Stylelint`,
    );
    console.log(`${colors.green}🧪${colors.reset} Jest ${versions.jest} + Testing Library ${versions.testingLibrary}`);
    console.log(`${colors.green}📊${colors.reset} React Query ${versions.reactQuery} + Zustand ${versions.zustand}`);
    console.log(
      `${colors.green}🎨${colors.reset} SCSS ${versions.sass} Modules + Style Dictionary ${versions.styleDictionary}`,
    );
    console.log(`${colors.green}🔒${colors.reset} Husky ${versions.husky} + lint-staged ${versions.lintStaged}`);

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
