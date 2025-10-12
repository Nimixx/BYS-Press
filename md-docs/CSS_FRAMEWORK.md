# Minimal CSS Framework

A lightweight, scalable CSS framework built on design tokens and semantic styles.

## 🎯 Philosophy

This framework provides **variables, not prescriptions**. Instead of utility classes, we provide:

- **Design Tokens**: CSS custom properties for consistent design
- **Base Styles**: Minimal reset and typography foundation
- **Semantic Structure**: Write meaningful, component-based CSS
- **Flexibility**: Use tokens to build your own components

**We don't provide utility classes.** We provide the building blocks to create maintainable, semantic CSS.

## 📁 Structure

```
css/
├── main.css                 # Main entry point
├── abstracts/              # Design tokens
│   └── tokens.css          # CSS custom properties
├── base/                   # Foundation
│   ├── reset.css           # Minimal reset
│   └── typography.css      # Base typography
├── layout/                 # Layout patterns
├── components/             # Semantic components
├── pages/                  # Page-specific styles
│   └── front-page.css
├── themes/                 # Theme variations
├── utilities/              # Essential utilities only
│   └── utilities.css       # .sr-only
└── vendors/                # Third-party CSS
```

## 🎨 Design Tokens

All design tokens are in `abstracts/tokens.css`:

**Colors**
- Primary, accent, neutral palettes (50-900 scales)
- Semantic colors (success, warning, error, info)
- Surface and background colors
- Text colors with alpha variations
- Border colors

**Spacing Scale** (4px base unit)
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-4: 1rem;       /* 16px */
--space-8: 2rem;       /* 32px */
/* ... up to --space-32 */
```

**Typography**
- Font families (base, heading, mono)
- Font sizes (xs to 8xl)
- Font weights (light to black)
- Line heights (none to loose)
- Letter spacing

**Sizing**
- Container widths (xs to 7xl)

**Borders**
- Border widths (0, 1px, 2px, 4px, 8px)
- Border radius (sm to full)

**Shadows**
- Elevation shadows (xs to 2xl)
- Colored shadows (primary, accent)

**Other**
- Z-index scale
- Transition durations and easing
- Breakpoint reference (in comments)

## ✍️ Writing CSS with Tokens

**Good - Semantic Components:**
```css
.card {
  padding: var(--space-6);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.card__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
}
```

**Avoid - Inline Styles:**
```html
<!-- Don't do this -->
<div style="padding: 24px; background: #1a1a1a;">
```

## 🔧 Base Styles

**Reset** (`base/reset.css`)
- Box-sizing: border-box
- Removes default margins/padding
- Improves text rendering
- Respects user motion preferences
- Accessible focus-visible states

**Typography** (`base/typography.css`)
- Responsive heading hierarchy (h1-h6)
- Typography utility classes for semantic styling
- Text colors, weights, and alignment
- Link, list, blockquote, and code styles

## 🛠 The Only Utility Class

We provide **one essential utility** for accessibility:

```css
.sr-only {
  /* Screen reader only - visually hidden but accessible */
}
```

**Usage:**
```html
<button>
  <svg>...</svg>
  <span class="sr-only">Close menu</span>
</button>
```

## 🚀 Adding New Styles

**1. Create a Component File**
```bash
# Create the file
touch components/card.css
```

**2. Write Semantic CSS with Tokens**
```css
/* components/card.css */

.card {
  padding: var(--space-6);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base) var(--ease-out);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card__title {
  margin-bottom: var(--space-4);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.card__body {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}
```

**3. Import in main.css**
```css
@import './components/card.css';
```

## 💡 Best Practices

1. **Always use design tokens** - Never hard-code values
   ```css
   /* Good ✓ */
   padding: var(--space-4);
   color: var(--color-primary-500);

   /* Bad ✗ */
   padding: 16px;
   color: #667eea;
   ```

2. **Use BEM naming** for component classes
   ```css
   .block { }
   .block__element { }
   .block__element--modifier { }
   ```

3. **Keep specificity low** - Avoid deep nesting
   ```css
   /* Good ✓ */
   .card__title { }

   /* Bad ✗ */
   .card .header .title { }
   ```

4. **Mobile-first** responsive design
   ```css
   /* Mobile (default) */
   .element { font-size: var(--font-size-base); }

   /* Tablet and up */
   @media (min-width: 768px) {
     .element { font-size: var(--font-size-lg); }
   }
   ```

5. **Avoid !important** - Keep CSS maintainable

6. **Document complex code** with comments

## 📱 Responsive Breakpoints

Reference (from tokens.css comments):
```css
/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

Use in media queries:
```css
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
```

## 🌈 Theming

Override tokens for theme variations:

```css
/* themes/dark.css */
:root {
  --color-background: #0a0a0a;
  --color-surface: #1a1a1a;
  --color-text-primary: #ffffff;
}

/* themes/light.css */
:root {
  --color-background: #ffffff;
  --color-surface: #f5f5f5;
  --color-text-primary: #0a0a0a;
}
```

## 📋 File Naming

- Use kebab-case: `front-page.css`, `nav-menu.css`
- Singular names: `button.css`, `card.css`
- Descriptive and semantic

## 🎯 Import Order

Order matters in `main.css`:

1. **Abstracts** - Tokens/variables (loaded first)
2. **Base** - Reset and typography
3. **Layout** - Structural patterns
4. **Components** - Semantic components
5. **Pages** - Page-specific styles
6. **Themes** - Theme overrides
7. **Utilities** - .sr-only only
8. **Vendors** - Third-party CSS

## 📚 Resources

- [BEM Methodology](http://getbem.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Modern CSS Reset](https://piccalil.li/blog/a-modern-css-reset/)
