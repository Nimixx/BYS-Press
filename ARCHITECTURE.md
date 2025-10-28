# Core Theme Architecture

## Overview

Modern, component-first WordPress theme built with minimalism, maintainability, and scalability in mind.

## Directory Structure

```
core-theme/
├── components/          # Reusable Twig components
│   ├── Button/
│   │   ├── Button.twig      # Template
│   │   ├── Button.css       # Styles
│   │   └── Button.php       # Context helper
│   ├── Card/
│   ├── Header/
│   └── Footer/
│
├── layouts/             # Page layouts
│   └── Base/
│       ├── Base.twig        # Main HTML structure
│       └── Base.css         # Layout styles
│
├── pages/               # Page templates
│   ├── FrontPage/
│   │   ├── FrontPage.twig   # Template
│   │   └── FrontPage.css    # Page styles
│   └── Index/
│
├── lib/                 # JavaScript/TypeScript
│   ├── main.ts              # Entry point
│   ├── composables/         # Vue composables
│   ├── types/               # TypeScript types
│   ├── utils/               # Helper functions
│   └── config/              # Configuration
│
├── config/              # Theme configuration
│   └── tokens.css           # Design tokens
│
├── src/                 # Global base styles
│   └── css/
│       ├── base/            # Reset, typography
│       ├── utilities/       # Utility classes
│       └── main.css         # Global imports
│
├── inc/                 # PHP classes
│   ├── Theme.php
│   ├── Assets.php
│   ├── TimberConfig.php
│   └── ...
│
└── dist/                # Build output
    ├── css/
    └── js/
```

## Core Principles

### 1. Component Co-location
All files related to a component live together:
```
components/Button/
  ├── Button.twig     # Markup
  ├── Button.css      # Styles
  └── Button.php      # Logic
```

### 2. CSS Auto-loading
All CSS files are automatically loaded using Vite's `import.meta.glob`:
- `components/**/*.css` - All component styles
- `layouts/**/*.css` - All layout styles
- `pages/**/*.css` - All page styles

**Add a new component? Its CSS is automatically included!**

No manual imports needed - just create `ComponentName.css` next to your `.twig` file.

### 3. Design Tokens
All design values centralized in `config/tokens.css`:
```css
:root {
  --color-primary-500: #667eea;
  --space-4: 1rem;
  --font-size-xl: 1.25rem;
}
```

### 4. Type Safety
PHP helpers provide structure and validation:
```php
Button::primary('Click Me', '/page', ['size' => 'large']);
```

## Creating Components

### Step 1: Create Directory
```bash
mkdir -p components/MyComponent
```

### Step 2: Create Template
**components/MyComponent/MyComponent.twig**
```twig
{#
  MyComponent

  @param {string} title - Component title
#}

<div class="{{ classes | default('my-component') }}">
  <h3>{{ title }}</h3>
</div>
```

### Step 3: Create Styles
**components/MyComponent/MyComponent.css**
```css
.my-component {
  padding: var(--space-4);
  background: var(--color-bg-secondary);
}
```

### Step 4: Create PHP Helper (Optional)
**components/MyComponent/MyComponent.php**
```php
<?php
namespace CoreTheme\Components;

class MyComponent
{
    public static function context(array $args = []): array
    {
        return [
            'title' => $args['title'] ?? '',
            'classes' => self::getClasses($args),
        ];
    }

    private static function getClasses(array $args): string
    {
        return 'my-component';
    }
}
```

### Step 5: Build
```bash
npm run build
```

**That's it!** Your component CSS is automatically loaded via `import.meta.glob`.
No manual imports needed in `main.ts` - the auto-loader handles it.

## Using Components

### In PHP Templates
```php
use CoreTheme\Components\Button;

$context = Timber::context();
$context['cta'] = Button::primary('Get Started', '/signup');

Timber::render('FrontPage/FrontPage.twig', $context);
```

### In Twig Templates
```twig
{# Direct usage #}
{% include 'Button/Button.twig' with {
    text: 'Click Me',
    url: '/page',
    variant: 'primary'
} %}

{# Using PHP helper #}
{% include 'Button/Button.twig' with cta %}
```

## Available Components

### Button
Flexible button with variants and sizes.

**PHP:**
```php
Button::primary('Text', '/url', ['size' => 'large']);
Button::secondary('Text', '/url');
Button::outline('Text', '/url');
Button::ghost('Text', '/url');
```

**Twig:**
```twig
{% include 'Button/Button.twig' with {
    text: 'Click Me',
    url: '/page',
    variant: 'primary|secondary|outline|ghost',
    size: 'small|base|large',
    full_width: false,
    disabled: false
} %}
```

### Card
Content card with image, title, description, and CTA.

**PHP:**
```php
Card::context([
    'title' => 'Title',
    'description' => 'Description',
    'image' => '/path/to/image.jpg',
    'url' => '/read-more',
    'cta_text' => 'Read More',
    'variant' => 'default|featured'
]);

// From WordPress post
Card::fromPost($post);
Card::fromPosts($posts);
```

**Twig:**
```twig
{% include 'Card/Card.twig' with {
    title: 'Card Title',
    description: 'Description...',
    image: '/image.jpg',
    url: '/link',
    cta_text: 'Read More',
    variant: 'featured'
} %}
```

## Build System

### Development
```bash
npm run dev
```
- Hot module replacement
- Fast refresh
- Source maps

### Production
```bash
npm run build
```
- Minification
- Tree shaking
- Asset optimization

### Testing
```bash
npm run test           # Run tests
npm run test:coverage  # Coverage report
```

## Design Tokens

Located in `config/tokens.css`, tokens provide a consistent design system.

### Colors
```css
--color-primary-500: #667eea;
--color-text-primary: #ffffff;
--color-bg-primary: #0a0a0a;
```

### Spacing (8px scale)
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-4: 1rem;     /* 16px */
--space-8: 2rem;     /* 32px */
```

### Typography
```css
--font-size-base: 1rem;
--font-size-xl: 1.25rem;
--font-weight-bold: 700;
--line-height-normal: 1.5;
```

## Best Practices

### 1. Use Design Tokens
❌ **Bad:**
```css
.button {
  padding: 12px 24px;
  color: #667eea;
}
```

✅ **Good:**
```css
.button {
  padding: var(--space-3) var(--space-6);
  color: var(--color-primary-500);
}
```

### 2. Co-locate Component Files
❌ **Bad:**
```
src/css/components/button.css
views/components/button.twig
inc/Components/Button.php
```

✅ **Good:**
```
components/Button/
  ├── Button.twig
  ├── Button.css
  └── Button.php
```

### 3. Use PHP Helpers
❌ **Bad:**
```php
$context['button'] = [
    'text' => 'Click',
    'url' => '/page',
    'classes' => 'button button--primary button--large'
];
```

✅ **Good:**
```php
$context['button'] = Button::primary('Click', '/page', [
    'size' => 'large'
]);
```

### 4. Keep Components Small
Each component should have a single responsibility.

## Performance

### Auto-discovered Assets
Components, layouts, and pages are automatically code-split.

### Lazy Loading
Use Vue lazy loading for heavy components:
```typescript
{
  elementId: 'gallery',
  loader: () => import('../../src/components/PhotoGallery.vue')
}
```

### CSS Optimization
- Minimal global styles
- Component-scoped styles
- Token-based consistency

## Troubleshooting

### Component not rendering
1. Check Timber can find the template:
   ```php
   error_log(print_r(Timber\Timber::$dirname, true));
   ```

2. Verify file exists:
   ```bash
   ls -la components/MyComponent/MyComponent.twig
   ```

### Styles not applying
1. Rebuild:
   ```bash
   npm run build
   ```

2. Check Vite auto-discovery:
   ```bash
   ls -la dist/css/components/
   ```

### PHP class not found
```bash
composer dump-autoload
```

## Migration from Old Structure

Components have been migrated from:
- `views/partials/` → `components/`
- `views/layouts/` → `layouts/`
- `views/pages/` → `pages/`
- `src/css/abstracts/tokens.css` → `config/tokens.css`
- `src/js/` → `lib/`

The `views/` directory has been removed.
