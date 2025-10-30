# Development Workflow

Daily development tasks, commands, and best practices for working with BYS Press theme.

## Daily Workflow

### Starting Your Day

```bash
# 1. Start dev server
npm run dev

# 2. Open your site
open http://your-site.local

# 3. Check for errors
tail -f wp-content/debug.log
```

### Making Changes

1. **Edit PHP** - Changes apply on refresh
2. **Edit Twig** - Changes apply on refresh (Timber cache off in dev)
3. **Edit CSS/JS** - Hot Module Replacement (instant update)
4. **Edit Vue** - Hot Module Replacement (instant update)

### Before Committing

```bash
# Run all checks
npm run check

# Or individually
npm run lint       # Check code quality
npm run format     # Format code
npm test:run       # Run tests
```

## NPM Commands

### Development

```bash
npm run dev         # Start dev server (HMR)
npm run build       # Build for production
npm run preview     # Preview production build
```

### Code Quality

```bash
npm run lint        # Lint all code
npm run lint:fix    # Auto-fix lint issues
npm run format      # Format all code (Prettier)
npm run format:check # Check if formatted
npm run check       # Lint + format check
```

### Testing

```bash
npm test           # Run tests in watch mode
npm run test:run   # Run tests once
npm run test:ui    # Open test UI
npm run test:coverage # Generate coverage report
```

### PHP Testing

```bash
composer test             # Run PHPUnit tests
composer test:coverage    # With coverage report
```

## Git Workflow

### Branch Strategy

```bash
# Main development branch
git checkout develop

# Create feature branch
git checkout -b feature/new-component

# Create fix branch
git checkout -b fix/button-style
```

### Committing

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add Alert component with variants"

# Push to remote
git push origin feature/new-component
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types**:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting)
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

**Examples**:
```bash
git commit -m "feat: Add Alert component"
git commit -m "fix: Button hover state in Safari"
git commit -m "docs: Update components guide"
git commit -m "refactor: Simplify security initialization"
```

## Code Style

### PHP

Follow [PSR-12](https://www.php-fig.org/psr/psr-12/):

```php
<?php
namespace BYSPress\MyNamespace;

class MyClass
{
    private string $property;

    public function __construct(string $property)
    {
        $this->property = $property;
    }

    public function myMethod(): string
    {
        if ($this->property) {
            return $this->property;
        }

        return 'default';
    }
}
```

### TypeScript

```typescript
// Use types
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// Use interfaces
interface User {
    id: number;
    name: string;
    email?: string;
}

// Use const for immutable
const API_URL = '/api';

// Use descriptive names
const isUserLoggedIn = checkAuth();
```

### CSS

Follow BEM methodology:

```css
/* Block */
.card {
    padding: 1rem;
}

/* Element */
.card__title {
    font-size: 1.5rem;
}

/* Modifier */
.card--featured {
    border: 2px solid gold;
}
```

### Twig

```twig
{# Use meaningful variable names #}
{% set postCount = posts|length %}

{# Keep logic simple #}
{% if post.thumbnail %}
    <img src="{{ post.thumbnail.src }}" alt="{{ post.title }}">
{% endif %}

{# Use filters #}
{{ post.date|date('F j, Y') }}
```

## File Organization

### When to Create New Files

**Create new PHP class when**:
- Adding new functionality
- Class becomes too large (>200 lines)
- Extracting reusable logic

**Create new Twig template when**:
- Creating reusable component
- Page needs custom layout
- Template becomes too complex

**Create new CSS file when**:
- Component has significant styles
- Styles are independently useful
- Want to lazy-load styles

### Where Files Go

```
inc/              # PHP classes
  ├── Assets/     # Asset management
  ├── Security/   # Security features
  ├── Context/    # Context providers
  └── Config/     # Configuration

components/       # Reusable Twig components

layouts/          # Page layouts

pages/            # Full page templates

src/              # Frontend source
  ├── components/ # Vue components
  ├── styles/     # CSS modules
  └── utils/      # TypeScript utilities
```

## Adding Features

### Adding a New Page Template

1. **Create PHP template**:

```php
<?php
/**
 * Template Name: Custom Page
 *
 * @package BYSPress
 */

if (!defined('ABSPATH')) {
    exit();
}

$context = Timber::context();
$context['post'] = Timber::get_post();
$context['custom_data'] = 'value';

Timber::render('pages/CustomPage/CustomPage.twig', $context);
```

2. **Create Twig template**:

```twig
{# pages/CustomPage/CustomPage.twig #}
{% extends "layouts/Base.twig" %}

{% block content %}
    <h1>{{ post.title }}</h1>
    <div>{{ post.content }}</div>
{% endblock %}
```

### Adding a Context Provider

1. **Create class**:

```php
<?php
namespace BYSPress\Context\Providers;

use BYSPress\Context\ContextProviderInterface;

class MyContextProvider implements ContextProviderInterface
{
    public function addToContext(array $context): array
    {
        $context['my_data'] = $this->getData();
        return $context;
    }

    private function getData(): array
    {
        return ['key' => 'value'];
    }
}
```

2. **Register in TimberConfig**:

```php
// inc/TimberConfig.php
private function registerContextProviders(): void
{
    // ... existing providers
    $this->contextProviders[] = new MyContextProvider();
}
```

### Adding a Utility

Create file in `inc/utilities/`:

```php
<?php
/**
 * My Custom Utility
 *
 * @package BYSPress
 */

if (!defined('ABSPATH')) {
    exit();
}

add_action('init', function() {
    // Your code here
});
```

File is automatically loaded by `UtilitiesManager`.

## Debugging

### PHP Debugging

**Enable debug mode**:

```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);
```

**View logs**:

```bash
tail -f wp-content/debug.log
```

**Debug variables**:

```php
error_log(print_r($variable, true));
var_dump($variable);
```

### Twig Debugging

**Dump variables**:

```twig
{{ dump(post) }}
{{ dump() }}  {# Dump all context #}
```

**Check variable exists**:

```twig
{% if my_var is defined %}
    {{ my_var }}
{% endif %}
```

### JavaScript Debugging

**Console logging**:

```typescript
console.log('Debug:', variable);
console.table(array);
console.error('Error:', error);
```

**Browser DevTools**:
- Press `F12` or `Cmd+Option+I`
- Check Console for errors
- Use Network tab for asset loading
- Use Elements tab for CSS debugging

### Vite Debugging

**Check dev server**:

```bash
# Should see output like:
# VITE v5.0.0  ready in 100 ms
# ➜  Local:   http://localhost:5173/
```

**Common issues**:
- Port already in use? Change in `vite.config.ts`
- Assets not loading? Check manifest.json exists
- HMR not working? Check browser console

## Performance

### Development Mode

```bash
# Fast builds, no optimization
npm run dev
```

- Source maps included
- No minification
- Fast rebuilds
- HMR enabled

### Production Mode

```bash
# Optimized builds
npm run build
```

- Minified code
- No source maps (or external)
- Tree shaking
- Code splitting
- Asset optimization

### Analyzing Bundle

```bash
npm run build -- --mode analyze
```

Shows what's in your bundle and how big files are.

## Testing

### PHP Unit Tests

**Run tests**:

```bash
composer test
```

**Create test**:

```php
// tests/ThemeTest.php
namespace BYSPress\Tests;

use PHPUnit\Framework\TestCase;
use BYSPress\Theme;

class ThemeTest extends TestCase
{
    public function testThemeBoots(): void
    {
        $theme = new Theme();
        $theme->boot();

        $this->assertInstanceOf(Theme::class, $theme);
    }
}
```

### JavaScript Tests

**Run tests**:

```bash
npm run test        # Watch mode
npm run test:run    # Run once
```

**Create test**:

```typescript
// src/utils/__tests__/helpers.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '../helpers';

describe('formatDate', () => {
    it('formats date correctly', () => {
        const date = new Date('2024-01-01');
        expect(formatDate(date)).toBe('January 1, 2024');
    });
});
```

## Deployment

### Pre-Deployment Checklist

```bash
# 1. Run all tests
npm run test:all

# 2. Build for production
npm run build

# 3. Check for errors
npm run check

# 4. Update version in style.css
```

### Production Build

```bash
# Build optimized assets
npm run build

# Files created in dist/
# - main.[hash].js
# - main.[hash].css
# - manifest.json
```

### What to Deploy

**Include**:
- `inc/`
- `components/`
- `layouts/`
- `pages/`
- `dist/`
- `vendor/`
- `functions.php`
- `style.css`
- `composer.json`

**Exclude** (add to `.gitignore`):
- `node_modules/`
- `src/` (optional, source files)
- `.env`
- `*.log`
- `.DS_Store`

### Deployment Commands

```bash
# Create bundle for deployment
npm run bundle

# Or manually:
npm run build
zip -r theme.zip . -x "node_modules/*" "src/*" ".*"
```

## Troubleshooting

### Assets Not Loading

1. Check dev server is running: `npm run dev`
2. Check `dist/manifest.json` exists
3. Clear browser cache
4. Check browser console for errors

### Twig Not Rendering

1. Check Timber is installed: `composer install`
2. Verify template file path is correct
3. Check for Twig syntax errors
4. Enable debug mode in wp-config.php

### White Screen

1. Enable WP_DEBUG in wp-config.php
2. Check wp-content/debug.log
3. Check PHP error logs
4. Verify PHP version is 8.1+

### Namespace Errors

1. Run `composer dump-autoload`
2. Check namespace matches file location
3. Verify `use` statements are correct

## Best Practices

1. **Always use dev server** during development
2. **Commit dist/ after building** (or use CI/CD)
3. **Test in production mode** before deploying
4. **Use branches** for features and fixes
5. **Write descriptive commits** for clarity
6. **Document complex code** with comments
7. **Keep functions small** (<50 lines)
8. **Use type hints** in PHP and TypeScript
9. **Test on multiple browsers** before release
10. **Update documentation** when adding features

---

**Next**: Learn about [Security Features](./security.md) for protecting your site.
