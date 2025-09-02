module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recess-order', // Property ordering
  ],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    // Allow both short and long hex colors (more flexible)
    'color-hex-length': null,

    // Spacing and formatting rules
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['first-nested', 'blockless-after-blockless'],
        ignore: ['after-comment'],
      },
    ],
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
      },
    ],

    // SCSS specific overrides
    'scss/at-rule-no-unknown': null,
    'scss/dollar-variable-pattern': null, // Allow any variable naming
    'scss/double-slash-comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['between-comments', 'stylelint-commands'],
      },
    ],

    // CSS quality enforcement
    'no-descending-specificity': true,
    'no-duplicate-selectors': true,

    // CSS unit best practices - Promote rem over px for accessibility
    'unit-disallowed-list': [
      ['px'],
      {
        ignoreProperties: {
          px: [
            'border-width',
            'border',
            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
            'outline-width',
            'outline',
            'box-shadow',
            '/^border.*radius$/',
          ],
        },
        message: 'Use rem instead of px for better accessibility. Pixels are only allowed for borders and box-shadows.',
      },
    ],

    // Allow CSS modules naming
    'selector-class-pattern': null,

    // Font family names should maintain proper casing (e.g., "Roboto", not "roboto")
    'value-keyword-case': [
      'lower',
      {
        ignoreProperties: ['font-family', '--font-family-primary', '--font-family-mono'],
        ignoreKeywords: ['Roboto', 'BlinkMacSystemFont', 'Monaco', 'Consolas', 'SF Mono', 'Courier New', 'Segoe UI'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.module.{css,scss}'],
      rules: {
        // More lenient rules for CSS modules
        'selector-pseudo-class-no-unknown': [
          true,
          {
            ignorePseudoClasses: ['export', 'import', 'global', 'local', 'external'],
          },
        ],
      },
    },
  ],
  ignoreFiles: [
    'node_modules/**/*',
    '.next/**/*',
    // Auto-generated style-dictionary files ONLY
    'src/styles/colors/colors.css',
    'src/styles/colors/colors.ts',
    'src/styles/breakpoints/breakpoints.css',
    'src/styles/breakpoints/breakpoints.ts',
    'src/styles/spacing/spacing.css',
    'src/styles/spacing/spacing.ts',
    'src/styles/typography/typography.css',
    'src/styles/typography/typography.ts',
    'src/styles/shadows/shadows.css',
    'src/styles/shadows/shadows.ts',
    'src/styles/borders/borders.css',
    'src/styles/borders/borders.ts',
    'src/styles/animations/animations.css',
    'src/styles/animations/animations.ts',
    'src/styles/design-tokens.css',
    'src/styles/design-tokens-example.scss',
  ],
};
