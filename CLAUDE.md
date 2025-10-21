# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Core Theme is a modern WordPress theme built with:
- **Backend**: PHP 8.1+ with PSR-4 autoloading, Timber (Twig templates), Composer
- **Frontend**: Vite 7.x, TypeScript 5.x, Vue 3, CSS Custom Properties
- **Testing**: PHPUnit (PHP) and Vitest (JavaScript/TypeScript)

## Essential Commands

### Development
```bash
npm run dev              # Start Vite dev server with HMR (localhost:5173)
npm run build            # Build optimized production assets
```

### Testing
```bash
npm test                 # Run Vitest in watch mode
npm run test:run         # Run Vitest once
npm run test:coverage    # Generate JavaScript coverage report
npm run test:php         # Run PHPUnit tests
composer test            # Alternative: Run PHPUnit
npm run test:all         # Run both Vitest and PHPUnit
```

### Code Quality
```bash
npm run lint             # Check JavaScript/TypeScript with ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run check            # Run lint + format check
composer test:coverage   # PHP coverage report
```

## Architecture Overview

### Bootstrap Flow
1. `functions.php` - Loads Composer autoloader and instantiates `CoreTheme\Theme`
2. `CoreTheme\Theme->boot()` - Initializes components in this order:
   - `Security->init()` - Generates CSP nonce, sets up security headers
   - `TimberConfig->init()` - Configures Timber/Twig with nonce in context
   - `ThemeSetup->init()` - Registers WordPress theme support
   - `Assets->init()` - Enqueues Vite-managed assets

### PHP Classes (PSR-4: `CoreTheme\` namespace in `inc/`)
- **Theme.php** - Main orchestrator, dependency injection container
- **ThemeSetup.php** - WordPress theme support (menus, thumbnails, feeds)
- **Assets.php** - Vite integration, asset enqueuing with performance optimizations
- **Security.php** - CSP with nonce-based inline scripts, security headers, REST API hardening
- **TimberConfig.php** - Timber configuration, makes CSP nonce available in Twig templates

### Frontend Entry Point
- **src/js/main.ts** - Main entry point that:
  1. Imports CSS (`src/css/main.css`)
  2. Sets up global error handlers
  3. Mounts Vue components from component registry
  4. Handles both eager and lazy-loaded components

### Component Registration System
- **src/js/config/vueComponents.ts** - Central registry for all Vue components
- Components are auto-mounted based on:
  - Element ID presence in DOM
  - Optional page conditions (e.g., front page only)
  - Required vs optional mounting
- Supports both eager and lazy loading

### Template Structure (Twig in `views/`)
- **layouts/base.twig** - Base template with blocks
- **pages/** - Page-specific templates (e.g., `front-page.twig`)
- **partials/** - Reusable components (header, footer)

### Security Architecture
- CSP nonce is generated in `Security->generateNonce()` during `init` action
- Nonce is passed to Timber context in `TimberConfig->addToContext()`
- Nonce is available in Twig templates as `{{ nonce }}`
- Inline scripts/styles in PHP get nonce via filters in Security class
- Production-only strict headers (checks `wp_get_environment_type()` or domain patterns)

### Asset Management
- Vite builds to `dist/` directory
- Development: Vite dev server on port 5173 with HMR
- Production: Optimized bundles with code splitting
- `@kucrut/vite-for-wp` handles WordPress integration
- Assets are enqueued with defer attribute for performance

## Key Development Patterns

### Adding a New Vue Component
1. Create component in `src/components/YourComponent.vue`
2. Import in `src/js/config/vueComponents.ts`
3. Add to `vueComponentRegistry` array with configuration:
   ```typescript
   {
     component: YourComponent,
     elementId: 'your-component',
     name: 'YourComponent',
     required: false, // or true if must exist
     condition: () => pageConditions.elementExists('your-component'),
     props: { /* optional props */ }
   }
   ```
4. Add mount point in Twig template: `<div id="your-component"></div>`

### Adding a New PHP Class
1. Create class in `inc/YourClass.php` with `namespace CoreTheme;`
2. Follow strict typing: use type declarations, return types
3. Add initialization in `Theme->boot()` if needed
4. PSR-4 autoloading handles class loading automatically

### Adding a New Twig Template
1. Create template in appropriate `views/` subdirectory
2. Use existing layouts: `{% extends "layouts/base.twig" %}`
3. Access CSP nonce via `{{ nonce }}` for inline scripts/styles
4. Create corresponding PHP template file (e.g., `page-example.php`) that renders Twig

### Environment Configuration
- Copy `.env.example` to `.env`
- Set `WP_HOME` to your local WordPress URL
- Set `VITE_DEV_SERVER_URL=http://localhost:5173` for HMR

## Testing Guidelines

### JavaScript/TypeScript Tests
- Location: Co-located with source files in `src/`
- Framework: Vitest with `@testing-library/vue`
- Test utilities: Available in `src/test-utils/`
- Run in watch mode during development: `npm test`

### PHP Tests
- Location: `tests/` directory
- Framework: PHPUnit 10+ with Brain Monkey for WordPress mocks
- Bootstrap: `tests/bootstrap.php`
- Namespace: `CoreTheme\Tests\`

### Writing Tests
- Test PHP classes for WordPress hooks, filters, and functionality
- Test JavaScript utilities and Vue components
- Mock WordPress functions using Brain Monkey
- Aim for good coverage on critical security and asset loading code

## Important Notes

### Security Considerations
- CSP nonce must be accessible throughout the theme (Security → TimberConfig → Twig)
- Security headers only apply in production (not on local/dev domains)
- Never skip nonce for inline scripts/styles in production
- REST API security restricts user enumeration for non-authenticated requests

### Vite Integration
- Dev mode: Uses Vite dev server, HMR works automatically
- Build mode: Generates static assets in `dist/` with integrity checking
- `v4wp` plugin handles WordPress-specific Vite configuration
- Assets are loaded with defer for better performance

### Timber/Twig
- Views directory is `views/` (configurable in TimberConfig)
- Context is enhanced with nonce and other global data
- Timber caching is enabled for performance
- Use Twig filters for escaping: `{{ value|e('html') }}`

### Code Style
- PHP: Strict types, PSR-4 autoloading, type declarations
- TypeScript: Strict mode enabled
- CSS: BEM methodology with CSS Custom Properties
- All code should pass linting: `npm run check` before commits

## Documentation
- Extended docs in `md-docs/` directory
- README.md covers installation and basic usage
- SECURITY.md details security implementation
- Individual guides: TESTING.md, ERROR_HANDLING.md, CUSTOMIZE.md, PERFORMANCE.md
