#!/usr/bin/env node
/* eslint-disable no-console */

const { spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

console.log('🎯 Interactive CLI Test');
console.log('=======================\n');
console.log('This will run the real CLI interactively, but restrict output to ./tmp/ directory\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function runInteractiveTest() {
  try {
    console.log('📝 Enter your project details (will be created in ./tmp/[project-name]):\n');

    // Get project details from user
    const projectName = await prompt('Project name (kebab-case): ');

    if (!projectName || !/^[a-z0-9-]+$/.test(projectName)) {
      console.log('❌ Invalid project name. Use kebab-case (lowercase, numbers, hyphens only)');
      process.exit(1);
    }

    const packageName = (await prompt(`Package name (default: ${projectName}): `)) || projectName;

    if (!/^[a-z0-9-]+$/.test(packageName)) {
      console.log('❌ Invalid package name. Use kebab-case');
      process.exit(1);
    }

    const description = await prompt('Project description: ');

    if (!description) {
      console.log('❌ Description is required');
      process.exit(1);
    }

    rl.close();

    // Force tmp directory for safety
    const targetDir = path.resolve(`./tmp/${projectName}`);

    console.log('\n📋 Configuration:');
    console.log(`  Project: ${projectName}`);
    console.log(`  Package: ${packageName}`);
    console.log(`  Description: ${description}`);
    console.log(`  Directory: ${targetDir}`);

    // Clean up if exists
    if (fs.existsSync(targetDir)) {
      console.log('\n🧹 Cleaning up existing directory...');
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    console.log('\n🚀 Running CLI...\n');
    console.log('='.repeat(60));

    // Run CLI with user inputs
    const child = spawn('node', ['./bin/create-scaffold-app.js'], {
      stdio: ['pipe', 'inherit', 'inherit'],
    });

    // Send inputs with small delays
    setTimeout(() => child.stdin.write(`${projectName}\n`), 100);
    setTimeout(() => child.stdin.write(`${packageName}\n`), 200);
    setTimeout(() => child.stdin.write(`${description}\n`), 300);
    setTimeout(() => child.stdin.write(`${targetDir}\n`), 400);
    setTimeout(() => child.stdin.end(), 500);

    child.on('close', (code) => {
      console.log('='.repeat(60));
      console.log(`\n🔍 CLI finished with exit code: ${code}`);

      if (code === 0) {
        if (fs.existsSync(targetDir)) {
          console.log('\n✅ Project created successfully!');
          console.log(`📁 Location: ${targetDir}`);

          // Show detailed results
          console.log('\n📊 Project Analysis:');

          try {
            const files = fs.readdirSync(targetDir);

            console.log(`📄 Total files/folders: ${files.length}`);

            // Check key files
            const keyFiles = ['package.json', 'README.md', 'src', 'docs', '.gitignore'];

            keyFiles.forEach((file) => {
              if (files.includes(file)) {
                console.log(`✅ ${file}`);
              } else {
                console.log(`❌ ${file} (missing)`);
              }
            });

            // Show package.json content
            const packageJsonPath = path.join(targetDir, 'package.json');

            if (fs.existsSync(packageJsonPath)) {
              console.log('\n📦 package.json verification:');
              const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

              console.log(`  Name: ${packageJson.name} ${packageJson.name === packageName ? '✅' : '❌'}`);
              console.log(
                `  Description: ${packageJson.description} ${packageJson.description === description ? '✅' : '❌'}`,
              );
            }

            // Show README content
            const readmePath = path.join(targetDir, 'README.md');

            if (fs.existsSync(readmePath)) {
              console.log('\n📄 README.md verification:');
              const readme = fs.readFileSync(readmePath, 'utf8');
              const firstLine = readme.split('\n')[0];
              const expectedTitle = `# ${packageName}`;

              console.log(`  Title: ${firstLine} ${firstLine === expectedTitle ? '✅' : '❌'}`);
            }

            // Show config.ts content
            const configPath = path.join(targetDir, 'src', 'config.ts');

            if (fs.existsSync(configPath)) {
              console.log('\n⚙️ config.ts verification:');
              const config = fs.readFileSync(configPath, 'utf8');
              const appNameLine = config.split('\n').find((line) => line.includes('appName'));
              const expectedAppName = `appName: '${packageName}' as const,`;

              if (appNameLine) {
                const actualAppName = appNameLine.trim();

                console.log(`  appName: ${actualAppName} ${actualAppName === expectedAppName ? '✅' : '❌'}`);
              } else {
                console.log('  appName: not found ❌');
              }
            }

            console.log('\n🎯 Next steps:');
            console.log(`  cd ${targetDir}`);
            console.log('  yarn install');
            console.log('  yarn dev');
          } catch (error) {
            console.log('❌ Could not analyze project structure');
          }
        } else {
          console.log('\n❌ Project directory was not created');
        }
      } else {
        console.log('\n❌ CLI failed');
      }
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
  }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Test cancelled');
  rl.close();
  process.exit(0);
});

runInteractiveTest();
