# Interactive CLI Testing Guide

Use this guide to test the CLI interactively during development.

## Quick Start

```bash
# Interactive testing
yarn test-cli-interactive
```

## Example Interactive Session

When you run the interactive test, you'll see prompts like this:

```
🚀 Create Nextlane App
Bootstrap a modern frontend application with Nextlane's template

🔧 Running in local development mode

Project name (kebab-case): my-test-app
Package name (default: my-test-app): my-package
Project description: My awesome test application
Target directory (default: ./my-test-app): ./tmp/my-test-output

📋 Configuration Summary:
Project Name: my-test-app
Package Name: my-package
Description: My awesome test application
Target Directory: ./tmp/my-test-output

🔄 Creating project...
📁 Copying local template...
📄 Copying template files...
🔄 Configuring project...
🔧 Initializing git repository...
✅ Git repository initialized

🎉 Project created successfully!

Next steps:
1. cd ./tmp/my-test-output
2. yarn install
3. yarn dev

Happy coding! 🚀
```

## Testing Different Scenarios

### Valid Inputs

- **Project name**: `my-app`, `user-dashboard`, `admin-panel`
- **Package name**: `my-package`, `company-app` (or leave empty for default)
- **Description**: Any descriptive text
- **Directory**: `./tmp/test-1`, `./tmp/test-2`, etc.

### Testing Validations

- **Invalid project names**: `MyApp`, `my_app`, `123app`, `-app`
- **Empty required fields**: Leave project name or description empty
- **Existing directories**: Try to create in a directory that already exists

## Verifying Results

After creation, check:

1. **Directory created**: `ls ./tmp/your-directory`
2. **Files copied**: Main project structure should be present
3. **Placeholders replaced**:

   ```bash
   # Check package.json
   cat ./tmp/your-directory/package.json | grep "name\|description"

   # Check README.md
   head -3 ./tmp/your-directory/README.md
   ```

## Cleanup

```bash
# Remove test output
rm -rf ./tmp/test-*
rm -rf ./tmp/my-*

# The tmp/.gitkeep will remain (which is correct)
```
