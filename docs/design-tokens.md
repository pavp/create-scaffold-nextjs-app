# Design Tokens

This project uses a comprehensive **Design Tokens** system built with Style Dictionary to ensure consistent styling across all components and maintain design system coherence.

## 🎯 Overview

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They provide a single source of truth for design decisions like colors, spacing, typography, and more.

### Key Benefits

- **Consistency**: Single source of truth for all design values
- **Maintainability**: Update values globally by changing tokens
- **Developer Experience**: Autocomplete and type safety
- **Scalability**: Easy to add new tokens and categories

## 📁 Structure

```
src/styles/
├── tokens.ts                    # Main tokens export (use this!)
├── design-tokens.css            # Global CSS custom properties
├── colors/
│   ├── colors.ts               # TypeScript color tokens
│   ├── colors.css              # CSS custom properties
│   └── index.ts                # Clean import helper
├── spacing/
│   ├── spacing.ts              # TypeScript spacing tokens
│   ├── spacing.css             # CSS custom properties
│   └── index.ts                # Clean import helper
├── typography/
│   ├── typography.ts           # TypeScript typography tokens
│   ├── typography.css          # CSS custom properties
│   └── index.ts                # Clean import helper
├── shadows/
├── borders/
├── breakpoints/
├── animations/
└── style-dictionary/           # Build configuration
    ├── build.mjs              # Main build script
    ├── config/                # Category configurations
    └── tokens/                # Source token definitions
```

## 🚀 Usage

### TypeScript/TSX (Recommended for inline styles)

```typescript
import tokens from '@/styles/tokens';

// Individual category import
import colors from '@/styles/colors';
import spacing from '@/styles/spacing';

// Usage in components
<Box sx={{
  backgroundColor: tokens.colors.semanticBrandPrimary,
  padding: tokens.spacing.scale4,
  borderRadius: tokens.borders.radiusMd,
}} />

// Or with category imports
<Box sx={{
  backgroundColor: colors.semanticBrandPrimary,
  padding: spacing.scale4,
}} />
```

### CSS/SCSS (Recommended for stylesheets)

```scss
// All tokens are globally available as CSS custom properties
.my-component {
  background-color: var(--color-semantic-brand-primary);
  padding: var(--spacing-scale4);
  border-radius: var(--border-radius-md);

  // Responsive design
  @media (min-width: var(--breakpoint-tablet-min)) {
    padding: var(--spacing-scale8);
  }

  // Hover states
  &:hover {
    background-color: var(--color-semantic-brand-primary-hover);
    box-shadow: var(--shadow-md);
  }
}
```

## 🎨 Available Token Categories

### Colors (`--color-*`)

```scss
/* Primitive colors - base palette */
--color-primitive-blue50: #f0f9ff;
--color-primitive-blue500: #2a165b;
--color-primitive-white: #ffffff;

/* Semantic colors - contextual usage */
--color-semantic-brand-primary: #2a165b;
--color-semantic-text-primary: #222222;
--color-semantic-background-surface: #f2f2f2;
--color-semantic-feedback-success: #28a745;
```

### Spacing (`--spacing-*`)

```scss
/* Scale-based spacing */
--spacing-scale0: 0rem; /* 0px */
--spacing-scale1: 0.25rem; /* 4px */
--spacing-scale2: 0.5rem; /* 8px */
--spacing-scale4: 1rem; /* 16px */
--spacing-scale8: 2rem; /* 32px */

/* Component-specific spacing */
--button-padding-x: 1.5rem; /* 24px */
--modal-padding: 1.5rem; /* 24px */
--card-padding: 1rem; /* 16px */
```

### Typography (`--font-*`)

```scss
/* Font families */
--font-family-primary: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-mono: 'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace;

/* Font sizes */
--font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */

/* Font weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;

/* Line heights */
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Breakpoints (`--breakpoint-*`)

```scss
--breakpoint-mobile-min: 0px;
--breakpoint-mobile-max: 767px;
--breakpoint-tablet-min: 768px;
--breakpoint-tablet-max: 1023px;
--breakpoint-desktop-min: 1024px;
--breakpoint-desktop-large-screen: 1440px;
```

### Shadows (`--shadow-*`)

```scss
--shadow-none: none;
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-focus: 0 0 0 3px rgba(42, 22, 91, 0.1);
```

### Borders (`--border-*`)

```scss
/* Border widths */
--border-width-none: 0px;
--border-width-thin: 1px;
--border-width-medium: 2px;

/* Border radius */
--border-radius-none: 0px;
--border-radius-sm: 4px;
--border-radius-base: 6px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
--border-radius-full: 9999px;

/* Border styles */
--border-style-solid: solid;
--border-style-dashed: dashed;
```

### Animations (`--duration-*`, `--easing-*`, `--transition-*`)

```scss
/* Durations */
--duration-instant: 0ms;
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

/* Easing functions */
--easing-linear: linear;
--easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
--easing-ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Predefined transitions */
--transition-fast: all 150ms cubic-bezier(0, 0, 0.2, 1);
--transition-normal: all 300ms cubic-bezier(0, 0, 0.2, 1);
```

## 🛠️ Build System

### Commands

```bash
# Build all design tokens
yarn build:dictionary

# Development server (includes token build)
yarn dev

# Production build (includes token build)
yarn build
```

### Build Process

The build system uses **Style Dictionary** to generate tokens in multiple formats:

1. **TypeScript files** (`.ts`) - For programmatic usage with autocomplete
2. **CSS custom properties** (`.css`) - For stylesheet usage
3. **Clean imports** (`index.ts`) - For simplified imports
4. **Consolidated export** (`tokens.ts`) - Single import point

### Adding New Tokens

1. **Edit source files**: Modify JSON files in `/src/styles/style-dictionary/tokens/`
2. **Run build**: Execute `yarn build:dictionary`
3. **Use tokens**: Import and use the new tokens in your code

Example: Adding a new color

```json
// src/styles/style-dictionary/tokens/colors.json
{
  "color": {
    "primitive": {
      "purple": {
        "500": { "value": "#8b5cf6" }
      }
    }
  }
}
```

After build, available as:

- CSS: `var(--color-primitive-purple500)`
- TypeScript: `tokens.colors.primitivePurple500`

## 🎨 Best Practices

### 1. Prefer CSS Custom Properties in Stylesheets

```scss
/* ✅ Good - CSS custom properties */
.button {
  background-color: var(--color-semantic-brand-primary);
  padding: var(--spacing-scale4);
}

/* ❌ Avoid - hardcoded values */
.button {
  background-color: #2a165b;
  padding: 1rem;
}
```

### 2. Use TypeScript Tokens for Inline Styles

```tsx
/* ✅ Good - TypeScript tokens with autocomplete */
<Box sx={{
  backgroundColor: tokens.colors.semanticBrandPrimary,
  padding: tokens.spacing.scale4,
}} />

/* ❌ Avoid - hardcoded values */
<Box sx={{
  backgroundColor: '#2a165b',
  padding: '1rem',
}} />
```

### 3. Use Semantic Tokens Over Primitive

```scss
/* ✅ Good - semantic meaning */
.error-message {
  color: var(--color-semantic-feedback-error);
}

/* ❌ Avoid - primitive colors (less flexible) */
.error-message {
  color: var(--color-primitive-red500);
}
```

### 4. Use Consistent Spacing Scale

```scss
/* ✅ Good - consistent scale */
.card {
  padding: var(--spacing-scale4);
  margin-bottom: var(--spacing-scale6);
}

/* ❌ Avoid - random values */
.card {
  padding: 15px;
  margin-bottom: 23px;
}
```

### 5. Leverage Component-Specific Tokens

```scss
/* ✅ Good - component tokens */
.button {
  padding: var(--button-padding-y) var(--button-padding-x);
}

/* ✅ Also good - scale tokens */
.button {
  padding: var(--spacing-scale3) var(--spacing-scale6);
}
```

## 🔧 IDE Support

### VSCode

The project includes TypeScript definitions for full autocomplete support:

```typescript
import tokens from '@/styles/tokens';

// Autocomplete will show all available tokens
tokens.colors.   // <- shows all color options
tokens.spacing.  // <- shows all spacing options
```

### CSS IntelliSense

CSS custom properties have autocomplete support in modern editors with proper CSS language servers.

## 📚 Additional Resources

- **Style Dictionary Documentation**: [amzn.github.io/style-dictionary](https://amzn.github.io/style-dictionary/)
- **CSS Custom Properties**: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- **Design Tokens W3C Specification**: [design-tokens.github.io](https://design-tokens.github.io/community-group/)

## 🤔 FAQ

**Q: Should I use CSS custom properties or TypeScript tokens?**  
A: Use CSS custom properties (`var(--token)`) in `.scss` files and TypeScript tokens (`tokens.colors.name`) for inline styles in components.

**Q: Can I add custom values alongside tokens?**  
A: For one-off cases, yes, but prefer creating new tokens for reusable values.

**Q: How do I know which tokens are available?**  
A: Use TypeScript autocomplete with `import tokens from '@/styles/tokens'` or check the generated files in `/src/styles/`.

**Q: What if I need a value that doesn't exist as a token?**  
A: Either add it to the appropriate token file in `/src/styles/style-dictionary/tokens/` or use a hardcoded value for truly unique cases.
