/* eslint-disable no-console */
import { dirname } from 'path';
import StyleDictionary from 'style-dictionary';
import { fileURLToPath } from 'url';

import { toCamelCaseBreakpoint, toCamelCaseColor, toLowerCamelCaseColor } from './utils.mjs';

const CONFIG_PATHS = {
  colors: '/config/colors-config.json',
  breakpoints: '/config/breakpoint-config.json',
};

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

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration
const __dirname = dirname(fileURLToPath(import.meta.url));
const colorsStyleDictionary = new StyleDictionary(__dirname + CONFIG_PATHS.colors);
const breakpointsStyleDictionaty = new StyleDictionary(__dirname + CONFIG_PATHS.breakpoints);

// FINALLY, BUILD ALL THE PLATFORMS
await colorsStyleDictionary.buildAllPlatforms();
await breakpointsStyleDictionaty.buildAllPlatforms();

console.log('\nBuild dictionary completed!');
console.log('\n==============================================');
console.log('\n');
