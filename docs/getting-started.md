# Getting Started with BYS Press

This guide will help you install, configure, and start developing with the BYS Press theme.

## Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.1+** - Required for modern PHP features
- **WordPress 6.0+** - Theme requires modern WordPress
- **Node.js 18+** - For frontend build tools
- **npm** - Package manager for Node.js
- **Composer** - PHP dependency manager
- **Timber Plugin** - Or use Composer to install Timber

## Installation

### 1. Clone or Download the Theme

```bash
cd wp-content/themes/
git clone https://github.com/bys-press/bys-press.git
cd bys-press
```

Or download and extract the theme ZIP file to `wp-content/themes/bys-press/`.

### 2. Install PHP Dependencies

```bash
composer install
```

This installs:
- Timber (Twig templating)
- Vite for WP (Asset management)
- Development dependencies (PHPUnit, etc.)

### 3. Install Node Dependencies

```bash
npm install
```

This installs:
- Vite (Build tool)
- TypeScript (Type checking)
- Vue 3 (Component framework)
- ESLint, Prettier (Code quality)

### 4. Activate the Theme

1. Go to **WordPress Admin → Appearance → Themes**
2. Activate **BYS Press**
3. The theme will automatically initialize

## Development Workflow

### Starting Development Server

For local development with hot module replacement (HMR):

```bash
npm run dev
```

This starts Vite development server with:
- **Hot Module Replacement** - Changes appear instantly
- **Fast refresh** - No full page reloads
- **TypeScript checking** - Type errors in terminal
- **Available at**: `http://localhost:5173`

**Important**: Keep this running while developing. Your WordPress site will automatically load assets from the dev server.

### Building for Production

When ready to deploy:

```bash
npm run build
```

This creates optimized assets in `dist/`:
- Minified JavaScript
- Optimized CSS
- Hashed filenames for cache busting
- Source maps for debugging

### Preview Production Build

To test the production build locally:

```bash
npm run preview
```

## Project Structure

Understanding where files go:

```
bys-press/
├── functions.php          # Theme entry point (bootstrap)
├── style.css             # Theme header/metadata
│
├── inc/                  # PHP Classes (autoloaded via PSR-4)
│   ├── Theme.php         # Main orchestrator class
│   ├── ThemeSetup.php    # WordPress theme supports
│   ├── TimberConfig.php  # Timber configuration
│   ├── Security.php      # Security features
│   ├── Assets.php        # Asset management
│   │
│   ├── Assets/          # Asset management classes
│   ├── Context/         # Timber context providers
│   ├── Security/        # Security classes
│   ├── Config/          # Configuration files
│   └── utilities/       # WordPress optimizations
│
├── components/          # Reusable Twig components
│   └── ComponentName/
│       ├── ComponentName.twig  # Twig template
│       └── ComponentName.php   # PHP helper (optional)
│
├── layouts/            # Page layout templates (Twig)
│   └── Base.twig      # Main layout
│
├── pages/             # Page templates (Twig)
│   ├── Index/        # Blog index
│   └── FrontPage/    # Home page
│
├── src/              # Frontend source code
│   ├── main.ts       # JavaScript entry point
│   ├── main.css      # CSS entry point
│   └── components/   # Vue components
│
├── dist/             # Built assets (generated, git-ignored)
│
├── vendor/           # PHP dependencies (Composer)
└── node_modules/     # Node dependencies (npm)
```

## Configuration

### Environment Detection

The theme automatically detects your environment:

**Development Mode** (Any of these):
- `WP_DEBUG` is `true`
- Domain contains: localhost, .local, .test, .dev
- `wp_get_environment_type()` returns 'local' or 'development'

**Production Mode**:
- `wp_get_environment_type()` returns 'production'
- None of the development conditions are met

### Development vs Production Behavior

| Feature | Development | Production |
|---------|-------------|------------|
| Security Headers | Disabled | Enabled |
| Timber Cache | Disabled | Enabled |
| Assets | Vite dev server | Built files in dist/ |
| Debug Info | Verbose | Minimal |

### wp-config.php Settings

Add to your `wp-config.php`:

```php
// Development
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('WP_ENVIRONMENT_TYPE', 'local');

// Production
define('WP_DEBUG', false);
define('WP_ENVIRONMENT_TYPE', 'production');
```

## First Steps

### 1. Check Theme Activation

After activating, verify:

```bash
# Check PHP errors
tail -f wp-content/debug.log

# Check if assets load
# Visit your site and open browser DevTools → Network
```

### 2. Run Development Server

```bash
npm run dev
```

Open your WordPress site. You should see:
- Assets loading from `localhost:5173`
- Hot module replacement working
- No console errors

### 3. Make Your First Change

Edit `src/main.css`:

```css
body {
  background-color: #f0f0f0; /* Change this */
}
```

Save and watch the change appear instantly without refresh!

### 4. Create a Test Component

See [Components Guide](./components.md) for creating your first component.

## Common Tasks

### Adding a New PHP Class

1. Create file in `inc/` or subdirectory
2. Use namespace `BYSPress` or `BYSPress\SubDirectory`
3. Class is autoloaded via PSR-4 (no require needed)

```php
<?php
namespace BYSPress;

class MyNewClass {
    public function init(): void {
        // Your code
    }
}
```

### Adding a New Twig Template

1. Create `.twig` file in `pages/`, `layouts/`, or `components/`
2. Use from PHP:

```php
$context = Timber::context();
$context['my_data'] = 'Hello';
Timber::render('pages/MyPage.twig', $context);
```

### Adding Frontend JavaScript

1. Edit `src/main.ts` or create new file
2. Import in `src/main.ts`:

```typescript
import './my-feature.ts';
```

3. Changes appear instantly with HMR

### Adding Styles

1. Edit `src/main.css` or create new file
2. Import in `src/main.css`:

```css
@import './components/my-component.css';
```

3. Changes appear instantly

## Troubleshooting

### Assets Not Loading

**Problem**: Styles/scripts don't load

**Solutions**:
1. Check `npm run dev` is running
2. Check `dist/manifest.json` exists (run `npm run build`)
3. Clear WordPress cache
4. Check browser console for errors

### White Screen of Death

**Problem**: Site shows blank page

**Solutions**:
1. Enable `WP_DEBUG` in `wp-config.php`
2. Check `wp-content/debug.log`
3. Verify Composer dependencies: `composer install`
4. Check PHP version: `php -v` (need 8.1+)

### Timber Not Working

**Problem**: Twig templates not rendering

**Solutions**:
1. Install Timber plugin OR ensure Composer autoload works
2. Check `vendor/` folder exists
3. Run `composer install`
4. Verify `Timber\Timber` class exists

### HMR Not Working

**Problem**: Changes don't appear automatically

**Solutions**:
1. Restart dev server: `npm run dev`
2. Check Vite dev server is accessible at `localhost:5173`
3. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. Check browser console for errors

### Composer Errors

**Problem**: Namespace not found errors

**Solutions**:
1. Regenerate autoloader: `composer dump-autoload`
2. Check `composer.json` autoload section
3. Verify class namespace matches file location

## Next Steps

Now that you're set up:

1. **Understand the Architecture** → Read [Architecture](./architecture.md)
2. **Learn Timber & Twig** → Read [Timber & Twig](./timber-twig.md)
3. **Create Components** → Read [Components](./components.md)
4. **Development Workflow** → Read [Development](./development.md)

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Check code quality
npm run lint:fix        # Fix code issues
npm run format          # Format all code
npm run format:check    # Check formatting

# Testing
npm run test            # Run JS tests
npm run test:php        # Run PHP tests
npm run test:all        # Run all tests

# PHP
composer install        # Install dependencies
composer dump-autoload  # Regenerate autoloader
composer test          # Run PHPUnit tests
```

---

**Ready to build?** Continue to [Architecture](./architecture.md) to understand how the theme works.
