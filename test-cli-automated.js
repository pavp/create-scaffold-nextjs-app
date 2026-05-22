#!/usr/bin/env node
/* eslint-disable no-console */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing CLI with automated inputs...\n');

// Clean up any existing test output
const testDir = '/tmp/scaffold-cli-test';

if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}

const child = spawn('node', ['./bin/create-scaffold-app.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
});

let output = '';
let errorOutput = '';

child.stdout.on('data', (data) => {
  const text = data.toString();

  output += text;
  process.stdout.write(text);
});

child.stderr.on('data', (data) => {
  const text = data.toString();

  errorOutput += text;
  process.stderr.write(text);
});

// Send inputs with delays
setTimeout(() => child.stdin.write('test-project\n'), 100);
setTimeout(() => child.stdin.write('test-package\n'), 200);
setTimeout(() => child.stdin.write('A test project description\n'), 300);
setTimeout(() => child.stdin.write('/tmp/scaffold-cli-test\n'), 400);
setTimeout(() => child.stdin.end(), 500);

child.on('close', (code) => {
  console.log(`\n🔍 CLI finished with exit code: ${code}\n`);

  if (code === 0) {
    console.log('✅ CLI executed successfully');

    // Check results
    if (fs.existsSync(testDir)) {
      console.log('✅ Project directory created');

      // Check package.json
      const packageJsonPath = path.join(testDir, 'package.json');

      if (fs.existsSync(packageJsonPath)) {
        console.log('✅ package.json created');

        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        console.log('\n📄 package.json content:');
        console.log(`Name: ${packageJson.name}`);
        console.log(`Description: ${packageJson.description}`);

        if (packageJson.name === 'test-package') {
          console.log('✅ Package name replacement working');
        } else {
          console.log('❌ Package name replacement failed');
        }

        if (packageJson.description === 'A test project description') {
          console.log('✅ Description replacement working');
        } else {
          console.log('❌ Description replacement failed');
        }
      } else {
        console.log('❌ package.json not found');
      }

      // Check README.md
      const readmePath = path.join(testDir, 'README.md');

      if (fs.existsSync(readmePath)) {
        console.log('✅ README.md created');

        const readmeContent = fs.readFileSync(readmePath, 'utf8');

        if (readmeContent.includes('TEST PROJECT')) {
          console.log('✅ README project name replacement working');
        } else {
          console.log('❌ README project name replacement failed');
        }

        if (readmeContent.includes('A test project description')) {
          console.log('✅ README description replacement working');
        } else {
          console.log('❌ README description replacement failed');
        }
      } else {
        console.log('❌ README.md not found');
      }

      console.log('\n📁 Files created:');
      try {
        const files = fs.readdirSync(testDir);

        files.forEach((file) => console.log(`  - ${file}`));
      } catch (error) {
        console.log('❌ Could not list files');
      }
    } else {
      console.log('❌ Project directory not created');
    }
  } else {
    console.log('❌ CLI failed');
    console.log('Error output:', errorOutput);
  }

  console.log('\n✨ Test completed!');
});
