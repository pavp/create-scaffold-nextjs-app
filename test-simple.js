#!/usr/bin/env node
/* eslint-disable no-console */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 Simple CLI Test (tmp/ only)');
console.log('==============================\n');

// Predefined test values
const projectName = 'test-simple';
const packageName = 'test-simple-pkg';
const description = 'Simple test project';
const targetDir = path.resolve(`./tmp/${projectName}`);

console.log('📋 Test Configuration:');
console.log(`  Project: ${projectName}`);
console.log(`  Package: ${packageName}`);
console.log(`  Description: ${description}`);
console.log(`  Directory: ${targetDir}\n`);

// Clean up if exists
if (fs.existsSync(targetDir)) {
  console.log('🧹 Cleaning up existing directory...');
  fs.rmSync(targetDir, { recursive: true, force: true });
}

console.log('🚀 Running CLI...\n');

// Run CLI with predefined inputs
const child = spawn('node', ['./bin/create-scaffold-app.js'], {
  stdio: ['pipe', 'inherit', 'inherit'],
});

// Send inputs with delays
setTimeout(() => {
  console.log(`Sending project name: ${projectName}`);
  child.stdin.write(`${projectName}\n`);
}, 100);

setTimeout(() => {
  console.log(`Sending package name: ${packageName}`);
  child.stdin.write(`${packageName}\n`);
}, 200);

setTimeout(() => {
  console.log(`Sending description: ${description}`);
  child.stdin.write(`${description}\n`);
}, 300);

setTimeout(() => {
  console.log(`Sending target dir: ${targetDir}`);
  child.stdin.write(`${targetDir}\n`);
}, 400);

setTimeout(() => {
  child.stdin.end();
}, 500);

child.on('close', (code) => {
  console.log('\n' + '='.repeat(50));
  console.log(`\n🔍 CLI finished with exit code: ${code}`);

  if (code === 0) {
    if (fs.existsSync(targetDir)) {
      console.log('\n✅ Test completed successfully!');
      console.log(`📁 Results in: ${targetDir}`);

      // Check key files
      const packageJsonPath = path.join(targetDir, 'package.json');
      const readmePath = path.join(targetDir, 'README.md');

      if (fs.existsSync(packageJsonPath)) {
        console.log('\n📦 package.json:');
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

          console.log(`  Name: ${packageJson.name}`);
          console.log(`  Description: ${packageJson.description}`);
        } catch (error) {
          console.log('  ❌ Could not read package.json');
        }
      }

      if (fs.existsSync(readmePath)) {
        console.log('\n📄 README.md (first 3 lines):');
        try {
          const readme = fs.readFileSync(readmePath, 'utf8');
          const lines = readme.split('\n').slice(0, 3);

          lines.forEach((line) => console.log(`  ${line}`));
        } catch (error) {
          console.log('  ❌ Could not read README.md');
        }
      }
    } else {
      console.log('\n❌ Target directory was not created');
    }
  } else {
    console.log('\n❌ CLI failed');
  }
});
