/* eslint-disable no-console */
import { dirname } from 'path';
import StyleDictionary from 'style-dictionary';
import { fileURLToPath } from 'url';

import { toCamelCase, toCamelCaseBreakpoint, toCamelCaseColor, toKebabCase, toLowerCamelCaseColor } from './utils.mjs';

const CONFIG_PATHS = {
  colors: '/config/colors-config.json',
  breakpoints: '/config/breakpoint-config.json',
  spacing: '/config/spacing-config.json',
  typography: '/config/typography-config.json',
  shadows: '/config/shadows-config.json',
  borders: '/config/borders-config.json',
  animations: '/config/animations-config.json',
};

// ========================================
// CSS CUSTOM PROPERTIES FORMAT
// ========================================
StyleDictionary.registerFormat({
  name: 'css-custom-properties',
  format: function ({ dictionary, options }) {
    const category = options.category || 'tokens';
    let output = `/* Auto-generated ${category} design tokens - Do not edit manually */\n`;

    output += ':root {\n';

    dictionary.allTokens.forEach((token) => {
      const cssName = toKebabCase(token.name);

      // Add category prefix for consistency across all token types
      let finalName = cssName;

      if (category === 'spacing' && cssName.startsWith('scale')) {
        finalName = `spacing-${cssName}`;
      } else if (category === 'breakpoints') {
        finalName = `breakpoint-${cssName}`;
      } else if (category === 'colors') {
        finalName = `color-${cssName}`;
      } else if (category === 'animations') {
        // Keep existing prefixes for animations (duration-, easing-, transition-)
        finalName = cssName;
      }

      output += `  --${finalName}: ${token.value};\n`;
    });

    output += '}\n';

    return output;
  },
});

// ========================================
// ENHANCED JAVASCRIPT FORMATS
// ========================================
StyleDictionary.registerFormat({
  name: 'custom-js-format-colors',
  format: function ({ dictionary }) {
    let output = '// This file is auto-generated. Do not edit manually.\n';

    output += 'export const colors = {\n';

    dictionary.allTokens.forEach((token) => {
      const transformedName = toCamelCaseColor(token.name);

      output += `  ${transformedName}: '${token.value}',\n`;
    });

    output += '} as const;\n\n';
    output += 'export default colors;\n';

    return output;
  },
});

StyleDictionary.registerFormat({
  name: 'custom-js-format-generic',
  format: function ({ dictionary, options }) {
    const exportName = options.exportName || 'tokens';
    let output = '// This file is auto-generated. Do not edit manually.\n';

    output += `export const ${exportName} = {\n`;

    dictionary.allTokens.forEach((token) => {
      const transformedName = toCamelCase(token.name);
      // Escape quotes in token values for JavaScript
      const escapedValue = token.value.replace(/'/g, '"');

      output += `  ${transformedName}: '${escapedValue}',\n`;
    });

    output += '} as const;\n\n';
    output += `export default ${exportName};\n`;

    return output;
  },
});

StyleDictionary.registerFormat({
  name: 'custom-js-format-breakpoints',
  format: function ({ dictionary }) {
    let output = '// This file is auto-generated. Do not edit manually.\n';

    output += 'export const breakpoints = {\n';

    dictionary.allTokens.forEach((token) => {
      const transformedName = toCamelCaseBreakpoint(token.name);

      output += `  ${transformedName}: '${token.value}',\n`;
    });

    output += '} as const;\n\n';
    output += 'export default breakpoints;\n';

    return output;
  },
});

// ========================================
// ENHANCED SCSS FORMATS
// ========================================
StyleDictionary.registerFormat({
  name: 'custom-css-format-colors',
  format: function ({ dictionary }) {
    let output = '// This file is auto-generated. Do not edit manually.\n';

    dictionary.allTokens.forEach((token) => {
      const transformedName = toLowerCamelCaseColor(token.name);

      output += `$${transformedName}: ${token.value};\n`;
    });

    return output;
  },
});

StyleDictionary.registerFormat({
  name: 'custom-css-format-generic',
  format: function ({ dictionary }) {
    let output = '// This file is auto-generated. Do not edit manually.\n';

    dictionary.allTokens.forEach((token) => {
      const transformedName = toKebabCase(token.name);

      output += `$${transformedName}: ${token.value};\n`;
    });

    return output;
  },
});

StyleDictionary.registerFormat({
  name: 'custom-css-format-breakpoints',
  format: function ({ dictionary }) {
    let output = '// This file is auto-generated. Do not edit manually.\n';

    dictionary.allTokens.forEach((token) => {
      output += `$${token.name}: ${token.value};\n`;
    });

    return output;
  },
});

// ========================================
// CONSOLIDATED CSS FORMAT
// ========================================
StyleDictionary.registerFormat({
  name: 'css-consolidated',
  format: function ({ dictionary, options }) {
    let output = '/* Auto-generated design tokens - Do not edit manually */\n';

    output += '/* Import this file in your main CSS/SCSS to access all design tokens */\n\n';
    output += ':root {\n';

    // Group tokens by category for better organization
    const tokensByCategory = {};

    dictionary.allTokens.forEach((token) => {
      const category = token.type || 'misc';

      if (!tokensByCategory[category]) {
        tokensByCategory[category] = [];
      }
      tokensByCategory[category].push(token);
    });

    // Output tokens grouped by category
    Object.keys(tokensByCategory)
      .sort()
      .forEach((category) => {
        output += `\n  /* ${category.toUpperCase()} TOKENS */\n`;
        tokensByCategory[category].forEach((token) => {
          const cssName = toKebabCase(token.name);

          output += `  --${cssName}: ${token.value};\n`;
        });
      });

    output += '}\n';

    return output;
  },
});

// ========================================
// BUILD PROCESS
// ========================================
const __dirname = dirname(fileURLToPath(import.meta.url));

// Build configurations for each token category
const tokenCategories = [
  {
    name: 'colors',
    path: CONFIG_PATHS.colors,
    exportName: 'colors',
    folderPath: 'colors',
  },
  {
    name: 'breakpoints',
    path: CONFIG_PATHS.breakpoints,
    exportName: 'breakpoints',
    folderPath: 'breakpoints',
  },
  {
    name: 'spacing',
    path: CONFIG_PATHS.spacing,
    exportName: 'spacing',
    folderPath: 'spacing',
  },
  {
    name: 'typography',
    path: CONFIG_PATHS.typography,
    exportName: 'typography',
    folderPath: 'typography',
  },
  {
    name: 'shadows',
    path: CONFIG_PATHS.shadows,
    exportName: 'shadows',
    folderPath: 'shadows',
  },
  {
    name: 'borders',
    path: CONFIG_PATHS.borders,
    exportName: 'borders',
    folderPath: 'borders',
  },
  {
    name: 'animations',
    path: CONFIG_PATHS.animations,
    exportName: 'animations',
    folderPath: 'animations',
  },
];

// Console colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
};

const log = {
  header: (text) => console.log(`${colors.bright}${colors.cyan}${text}${colors.reset}`),
  success: (text) => console.log(`${colors.green}${text}${colors.reset}`),
  info: (text) => console.log(`${colors.blue}${text}${colors.reset}`),
  category: (text) => console.log(`${colors.bright}${colors.magenta}${text}${colors.reset}`),
  dim: (text) => console.log(`${colors.dim}${text}${colors.reset}`),
  separator: () => console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}`),
};

log.header('🚀 Style Dictionary Build Process');
log.separator();
console.log();

// Build each token category
for (const category of tokenCategories) {
  try {
    log.category(`📦 Building ${category.name} tokens...`);
    const styleDictionary = new StyleDictionary(__dirname + category.path);

    await styleDictionary.buildAllPlatforms();

    // Generate index.ts file for clean imports
    const indexPath = `src/styles/${category.folderPath}/index.ts`;
    const indexContent = `export { default } from './${category.name}';\n`;

    await import('fs').then((fs) => {
      fs.writeFileSync(indexPath, indexContent);
    });

    log.success(`   ✅ ${category.name} tokens built successfully`);
    console.log();
  } catch (error) {
    console.error(`${colors.bright}\x1b[31m❌ Error building ${category.name} tokens:${colors.reset}`);
    console.error(`${colors.dim}   ${error.message}${colors.reset}`);
    console.log();
  }
}

log.separator();
log.header('🎉 Style Dictionary Build Completed!');
log.separator();
console.log();
log.info('📁 Generated files per category:');
log.dim('   ├── TypeScript exports (colors.ts, spacing.ts, etc.)');
log.dim('   ├── CSS custom properties (colors.css, spacing.css, etc.)');
log.dim('   ├── Clean import helpers (index.ts in each folder)');
log.dim('   └── Consolidated tokens export (tokens.ts)');
console.log();
log.success('✨ All design tokens are ready to use!');
log.dim("   Import: import tokens from '@/styles/tokens';");
log.dim("   Or:     import colors from '@/styles/colors';");
console.log();
log.separator();
