# Project Structure

This document provides a comprehensive overview of the Core Theme project folder structure, explaining the purpose and organization of each directory and key files.

## Root Directory

```
core-theme/
├── inc/                        # PHP classes (PSR-4 autoloaded)
├── src/                        # Frontend source files (TypeScript, Vue, CSS)
├── views/                      # Twig templates
├── tests/                      # PHP and JavaScript tests
├── languages/                  # Translation files (.po, .mo, .pot)
├── md-docs/                    # Extended documentation
├── scripts/                    # Build and utility scripts
├── dist/                       # Compiled frontend assets (generated)
├── vendor/                     # PHP dependencies (generated)
├── node_modules/               # Node.js dependencies (generated)
└── public/                     # Public static assets
```

## Directory Structure Details

### `/inc/` - PHP Backend Classes

Core PHP classes using PSR-4 autoloading under the `CoreTheme` namespace.

```
inc/
├── Theme.php              # Main theme orchestrator, DI container
├── ThemeSetup.php         # WordPress theme support registration
├── Assets.php             # Vite integration and asset enqueuing
├── Security.php           # CSP nonce generation, security headers
└── TimberConfig.php       # Timber/Twig configuration
```

**Key Responsibilities:**
- **Theme.php**: Bootstrap entry point, initializes all components
- **ThemeSetup.php**: Registers menus, thumbnails, post type support
- **Assets.php**: Handles Vite dev server and production builds
- **Security.php**: CSP nonce generation, REST API hardening, XML-RPC protection
- **TimberConfig.php**: Twig environment setup, global context data

### `/src/` - Frontend Source Code

Modern frontend stack with TypeScript, Vue 3, and modular CSS.

```
src/
├── components/                 # Vue 3 components
│   └── Counter.vue            # Example component
├── js/                        # TypeScript/JavaScript
│   ├── main.ts               # Frontend entry point
│   ├── config.ts             # App configuration
│   ├── config/
│   │   └── vueComponents.ts  # Component registry
│   └── utils/
│       ├── errorHandler.ts   # Global error handling
│       └── vueComponentMount.ts # Component mounting logic
├── css/                       # Organized CSS architecture
│   ├── main.css              # Main CSS entry point
│   ├── abstracts/
│   │   └── tokens.css        # CSS custom properties (design tokens)
│   ├── base/
│   │   ├── reset.css         # CSS reset/normalize
│   │   └── typography.css    # Typography styles
│   ├── components/           # Component-specific styles
│   ├── layout/
│   │   ├── header.css
│   │   ├── footer.css
│   │   └── structure.css
│   ├── pages/
│   │   └── front-page.css    # Page-specific styles
│   ├── utilities/
│   │   └── utilities.css     # Utility classes
│   ├── themes/               # Theme variations
│   └── vendors/              # Third-party CSS
├── test-utils/
│   └── setup.ts              # Test configuration
├── vite-env.d.ts             # Vite type declarations
└── vue-shim.d.ts             # Vue type declarations
```

**Architecture Patterns:**
- **Component Registry**: All Vue components registered in `vueComponents.ts`
- **Auto-mounting**: Components mount based on element ID presence
- **Lazy Loading**: Support for code-split components
- **CSS Organization**: ITCSS-inspired architecture with clear separation

### `/views/` - Twig Templates

Timber-powered Twig templates for server-side rendering.

```
views/
├── layouts/
│   └── base.twig             # Base layout with blocks
├── pages/
│   ├── front-page.twig       # Homepage template
│   └── index.twig            # Default template
└── partials/
    ├── header.twig           # Site header
    └── footer.twig           # Site footer
```

**Template Hierarchy:**
- **layouts/**: Base templates with extensible blocks
- **pages/**: Page-specific templates
- **partials/**: Reusable template fragments

**Global Context Variables:**
- `{{ nonce }}` - CSP nonce for inline scripts/styles
- `{{ site }}` - WordPress site object
- `{{ wp }}` - WordPress functions

### `/tests/` - Test Suite

Comprehensive testing for PHP and JavaScript/TypeScript.

```
tests/
├── bootstrap.php              # PHPUnit bootstrap file
├── SecurityHeadersTest.php    # Security class tests
└── ThemeSetupTest.php         # Theme setup tests
```

**JavaScript Tests** (co-located with source):
- `src/js/config.test.ts`
- `src/js/utils/errorHandler.test.ts`

**Test Frameworks:**
- **PHP**: PHPUnit 10+ with Brain Monkey for WordPress mocks
- **JavaScript**: Vitest with @testing-library/vue

### `/languages/` - Internationalization

Translation files for WordPress i18n.

```
languages/
├── core-theme.pot            # Translation template
├── core-theme-cs_CZ.po       # Czech translations (source)
├── core-theme-cs_CZ.mo       # Czech translations (compiled)
└── README.md                 # Translation guidelines
```

**Text Domain**: `core-theme`
**Supported Languages**: Czech (cs_CZ), extensible for more

### `/md-docs/` - Extended Documentation

Detailed guides for specific topics.

```
md-docs/
├── CUSTOMIZE.md              # Customization guide
├── CSS_FRAMEWORK.md          # CSS architecture docs
├── ENV_USAGE.md              # Environment configuration
├── ERROR_HANDLING.md         # Error handling patterns
├── PERFORMANCE.md            # Performance optimization
├── TESTING.md                # Testing guidelines
└── TRANSLATION.md            # Translation workflow
```

### `/scripts/` - Build Utilities

Shell scripts for automation.

```
scripts/
└── bundle.sh                 # Bundle creation script
```

### `/dist/` - Compiled Assets (Generated)

Vite-generated production builds.

```
dist/
├── css/
│   └── main.css              # Compiled, minified CSS
├── js/
│   ├── main.js               # Compiled, minified JavaScript
│   └── main.js.map           # Source map
├── manifest.json             # Asset manifest
└── vite-dev-server.json      # Dev server status
```

**Notes:**
- Auto-generated during build process
- Excluded from version control
- Contains production-optimized assets

### `/vendor/` - PHP Dependencies (Generated)

Composer-managed PHP packages.

**Key Dependencies:**
- `timber/timber`: Twig templating for WordPress
- `symfony/var-dumper`: Advanced debugging
- `phpunit/phpunit`: Testing framework (dev)
- `brain/monkey`: WordPress mocking (dev)

### `/node_modules/` - Node Dependencies (Generated)

NPM-managed JavaScript packages.

**Key Dependencies:**
- `vite`: Build tool and dev server
- `vue`: Frontend framework
- `typescript`: Type system
- `vitest`: Testing framework
- `eslint`: Code linting
- `prettier`: Code formatting

## Root Configuration Files

### Build & Package Management

```
composer.json              # PHP dependencies and autoloading
composer.lock              # Locked PHP dependency versions
package.json               # Node.js dependencies and scripts
package-lock.json          # Locked Node.js dependency versions
bundle.config.json         # Bundle creation configuration
```

### Code Quality & Testing

```
phpunit.xml                # PHPUnit configuration
vitest.config.ts           # Vitest configuration
tsconfig.json              # TypeScript configuration
eslint.config.js           # ESLint rules
```

### Build Configuration

```
vite.config.js             # Vite build configuration
```

### WordPress Files

```
functions.php              # Theme entry point, loads autoloader
index.php                  # Fallback template
front-page.php             # Homepage template loader
style.css                  # Theme metadata (required by WordPress)
screenshot.png             # Theme preview image
```

### Documentation

```
README.md                  # Project overview and quick start
CLAUDE.md                  # AI assistant guidelines
STRUCTURE.md               # This file - project structure
SECURITY.md                # Security implementation details
INSTALL.md                 # Installation instructions
TASKS.md                   # Development task tracking
AUDIT.md                   # Project audit notes
IMPROVEMENT_PLAN.md        # Planned improvements
CLIENT_PROJECT_CHECKLIST.md # Client delivery checklist
```

## Bootstrap Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. WordPress Loads Theme                                    │
│    functions.php                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Composer Autoloader                                      │
│    vendor/autoload.php                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Theme Initialization                                     │
│    CoreTheme\Theme->boot()                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Component Initialization (in order)                     │
│    ├── Security->init()         [CSP nonce generation]     │
│    ├── TimberConfig->init()     [Twig setup]               │
│    ├── ThemeSetup->init()       [WP theme support]         │
│    └── Assets->init()           [Enqueue Vite assets]      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. WordPress Renders                                        │
│    ├── Loads template (e.g., front-page.php)               │
│    ├── Timber renders Twig (views/pages/front-page.twig)   │
│    └── Outputs HTML with nonce-secured inline scripts      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend JavaScript Loads                                │
│    src/js/main.ts                                           │
│    ├── Imports CSS (src/css/main.css)                      │
│    ├── Sets up error handlers                              │
│    └── Mounts Vue components from registry                 │
└─────────────────────────────────────────────────────────────┘
```

## Asset Pipeline

### Development Mode
```
npm run dev → Vite Dev Server (port 5173)
                    │
                    ├─→ HMR WebSocket
                    ├─→ Source Maps
                    └─→ Fast Refresh
                         │
                         ▼
                    Browser loads from
                    http://localhost:5173/@vite/client
```

### Production Mode
```
npm run build → Vite Build Process
                      │
                      ├─→ TypeScript Compilation
                      ├─→ CSS Processing
                      ├─→ Minification
                      ├─→ Code Splitting
                      └─→ Hash Generation
                           │
                           ▼
                      dist/ directory
                      ├── manifest.json
                      ├── css/main-[hash].css
                      └── js/main-[hash].js
                           │
                           ▼
                      WordPress enqueues
                      with integrity hashes
```

## Key Integration Points

### PHP ↔ JavaScript
- **CSP Nonce**: Generated in PHP (`Security`), passed to Twig templates, used in inline scripts
- **Asset Enqueuing**: `Assets.php` reads Vite manifest, enqueues with proper attributes
- **Data Passing**: Use `wp_localize_script()` or HTML data attributes

### Timber ↔ Vue
- **Server-Side**: Twig renders initial HTML structure
- **Client-Side**: Vue components mount on specific element IDs
- **Hybrid Rendering**: Twig for static content, Vue for interactive features

### Security Flow
```
Security->generateNonce()
         │
         ▼
TimberConfig->addToContext(['nonce' => ...])
         │
         ▼
Twig Template: {{ nonce }}
         │
         ▼
Inline <script nonce="{{ nonce }}">
         │
         ▼
Browser validates against CSP header
```

## File Naming Conventions

### PHP Classes
- **PascalCase**: `ThemeSetup.php`, `TimberConfig.php`
- **Namespace**: `CoreTheme\ClassName`

### JavaScript/TypeScript
- **camelCase**: `errorHandler.ts`, `vueComponentMount.ts`
- **Config files**: `*.config.js/ts`

### Vue Components
- **PascalCase**: `Counter.vue`, `HeaderNav.vue`

### CSS Files
- **kebab-case**: `front-page.css`, `utilities.css`

### Twig Templates
- **kebab-case**: `front-page.twig`, `base.twig`

### Test Files
- **Match source + suffix**: `Security.php` → `SecurityTest.php`
- **JS tests**: `errorHandler.ts` → `errorHandler.test.ts`

## Important Notes

### Generated Directories (Git-ignored)
- `/dist/` - Vite build output
- `/vendor/` - Composer dependencies
- `/node_modules/` - NPM dependencies
- `/coverage/` - Test coverage reports

### Required Files for WordPress
- `functions.php` - Theme bootstrap
- `style.css` - Theme metadata header
- `index.php` - Fallback template
- `screenshot.png` - Theme preview (880x660px recommended)

### Environment Files
- `.env.example` - Template for environment variables
- `.env` - Local configuration (git-ignored)

### Version Control
- `.gitignore` - Excludes generated files and sensitive data
- Commits should exclude `dist/`, `vendor/`, `node_modules/`

## Quick Reference

### Adding New Files

**PHP Class:**
1. Create in `inc/YourClass.php`
2. Use namespace `CoreTheme`
3. Initialize in `Theme->boot()` if needed

**Vue Component:**
1. Create in `src/components/YourComponent.vue`
2. Register in `src/js/config/vueComponents.ts`
3. Add mount point in Twig template

**CSS Module:**
1. Create in appropriate `src/css/` subdirectory
2. Import in `src/css/main.css` or specific page CSS

**Twig Template:**
1. Create in `views/pages/` or `views/partials/`
2. Create corresponding PHP template file if needed
3. Use `{% extends "layouts/base.twig" %}`

**Test File:**
1. PHP: Create in `tests/YourClassTest.php`
2. JS: Create co-located with source `your-file.test.ts`

## Architecture Principles

1. **Separation of Concerns**: PHP handles server-side logic, Vue handles interactivity
2. **Progressive Enhancement**: Works without JavaScript, enhanced with it
3. **Security First**: CSP nonces, REST API hardening, XML-RPC protection
4. **Performance Optimized**: Code splitting, lazy loading, asset optimization
5. **Developer Experience**: HMR, TypeScript, comprehensive testing
6. **Maintainability**: Clear structure, documented code, consistent patterns

## Related Documentation

- **Quick Start**: [README.md](README.md)
- **Installation**: [INSTALL.md](INSTALL.md)
- **Security Details**: [SECURITY.md](SECURITY.md)
- **Testing Guide**: [md-docs/TESTING.md](md-docs/TESTING.md)
- **Customization**: [md-docs/CUSTOMIZE.md](md-docs/CUSTOMIZE.md)
- **AI Guidelines**: [CLAUDE.md](CLAUDE.md)
