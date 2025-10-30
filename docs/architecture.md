# Theme Architecture

Understanding the BYS Press theme architecture is essential for effective development. This guide explains the design patterns, structure, and key concepts.

## Design Philosophy

### Core Principles

1. **Separation of Concerns** - Logic (PHP) separate from presentation (Twig)
2. **Object-Oriented** - Classes with single responsibilities
3. **Dependency Injection** - Explicit dependencies for testability
4. **PSR-4 Autoloading** - Standard PHP autoloading
5. **Modular Design** - Independent, reusable modules

### Architecture Patterns

- **Orchestrator Pattern** - Main `Theme` class coordinates components
- **Provider Pattern** - Context providers add data to Timber
- **Processor Pattern** - Transform data before rendering
- **Strategy Pattern** - Different behaviors for dev/production

## Bootstrap Process

### How the Theme Starts

```
functions.php (Entry Point)
    ↓
1. Load Composer autoloader
    ↓
2. Instantiate Theme class
    ↓
3. Call Theme::boot()
    ↓
4. Initialize components in order:
   - UtilitiesManager (WordPress optimizations)
   - Security (headers, CSP)
   - TimberConfig (Twig setup)
   - ThemeSetup (WordPress supports)
   - Assets (Vite, scripts, styles)
```

### functions.php

```php
<?php
// Load dependencies
require_once __DIR__ . '/vendor/autoload.php';

// Create and boot theme
$bysPress = new BYSPress\Theme();
$bysPress->boot();

// Global accessor function
function bys_press(): BYSPress\Theme {
    global $bysPress;
    return $bysPress;
}
```

**Key Points**:
- Single entry point
- Minimal code in `functions.php`
- All logic in classes
- Global function for theme instance access

## Main Classes

### Theme.php - The Orchestrator

**Location**: `inc/Theme.php`
**Namespace**: `BYSPress\Theme`
**Purpose**: Coordinates all theme components

```php
class Theme {
    private ThemeSetup $themeSetup;
    private Assets $assets;
    private Security $security;
    private TimberConfig $timberConfig;
    private UtilitiesManager $utilitiesManager;

    public function boot(): void {
        $this->utilitiesManager->init();  // 1. Load utilities
        $this->security->init();           // 2. Setup security
        $this->timberConfig->init();       // 3. Configure Timber
        $this->themeSetup->init();         // 4. WordPress setup
        $this->assets->init();             // 5. Enqueue assets
    }
}
```

**Responsibilities**:
- Initialize all components
- Maintain component instances
- Provide getters for component access
- Fire `bys_press_booted` action

### ThemeSetup.php - WordPress Configuration

**Location**: `inc/ThemeSetup.php`
**Purpose**: WordPress theme supports and features

```php
class ThemeSetup {
    public function init(): void {
        add_action('after_setup_theme', [$this, 'setup']);
    }

    public function setup(): void {
        $this->loadTextDomain();      // i18n
        $this->addThemeSupports();    // WordPress features
        $this->registerMenus();        // Navigation menus
    }
}
```

**Handles**:
- Text domain loading
- Theme supports (thumbnails, title-tag, etc.)
- Navigation menu registration

### TimberConfig.php - Template Engine

**Location**: `inc/TimberConfig.php`
**Purpose**: Configure Timber/Twig templating

```php
class TimberConfig {
    private array $viewsDirs = ['components', 'layouts', 'pages'];
    private array $contextProviders = [];

    public function init(): void {
        Timber::init();
        Timber::$dirname = $this->viewsDirs;
        add_filter('timber/context', [$this, 'addToContext']);
    }

    public function addToContext(array $context): array {
        foreach ($this->contextProviders as $provider) {
            $context = $provider->addToContext($context);
        }
        return $context;
    }
}
```

**Responsibilities**:
- Initialize Timber
- Set template directories
- Register context providers
- Configure caching
- Add global context data

### Assets.php - Asset Management

**Location**: `inc/Assets.php`
**Purpose**: Orchestrate asset loading and optimization

```php
class Assets {
    private AssetEnqueuer $enqueuer;
    private ScriptOptimizer $scriptOptimizer;
    private StyleOptimizer $styleOptimizer;
    private CriticalCssHandler $criticalCssHandler;
    private ResourceHints $resourceHints;

    public function init(): void {
        $this->enqueuer->init();
        $this->scriptOptimizer->init();
        $this->styleOptimizer->init();
        $this->criticalCssHandler->init();
        $this->resourceHints->init();
    }
}
```

**Delegates to**:
- `AssetEnqueuer` - Enqueue Vite assets
- `ScriptOptimizer` - Defer/async scripts
- `StyleOptimizer` - Optimize styles
- `CriticalCssHandler` - Inline critical CSS
- `ResourceHints` - Add preload/dns-prefetch

### Security.php - Security Features

**Location**: `inc/Security.php`
**Purpose**: Orchestrate security features

```php
class Security {
    private NonceManager $nonceManager;
    private HeaderSecurity $headerSecurity;
    private PermissionsPolicy $permissionsPolicy;
    private ContentSecurityPolicy $contentSecurityPolicy;
    private WordPressSecurity $wordPressSecurity;

    public function init(): void {
        $this->nonceManager->init();
        $this->wordPressSecurity->init();

        if ($this->isProduction()) {
            $this->headerSecurity->init();
            $this->permissionsPolicy->init();
            $this->contentSecurityPolicy->init();
        }
    }
}
```

**Handles**:
- CSP nonce generation
- Security headers
- Permissions policy
- Content Security Policy
- WordPress hardening

## Component Structure

### Asset Management

```
inc/Assets/
├── AssetEnqueuer.php      # Enqueue Vite assets
├── ScriptOptimizer.php    # Defer/async scripts
├── StyleOptimizer.php     # Optimize CSS
├── CriticalCssHandler.php # Critical CSS
└── ResourceHints.php      # Preload, dns-prefetch
```

Each class has single responsibility and is independently testable.

### Security Components

```
inc/Security/
├── NonceManager.php             # CSP nonce generation
├── HeaderSecurity.php           # Basic security headers
├── ContentSecurityPolicy.php    # CSP header
├── PermissionsPolicy.php        # Permissions-Policy header
└── WordPressSecurity.php        # WordPress hardening
```

Security features are modular and can be configured independently.

### Context Providers

```
inc/Context/
├── ContextProviderInterface.php      # Contract
├── Providers/
│   ├── MenuContextProvider.php       # Navigation menus
│   ├── AssetsContextProvider.php     # Theme assets
│   ├── RequestContextProvider.php    # Request data
│   └── SecurityContextProvider.php   # Security nonce
└── Processors/
    └── MenuProcessor.php             # Process menu data
```

**Provider Pattern**:
```php
interface ContextProviderInterface {
    public function addToContext(array $context): array;
}
```

Each provider adds specific data to Timber context.

## Data Flow

### Request to Response

```
1. WordPress loads theme
   ↓
2. functions.php bootstraps Theme
   ↓
3. Template file loads (index.php, front-page.php)
   ↓
4. Template calls Timber::context()
   ↓
5. Context providers add data
   ↓
6. Template calls Timber::render()
   ↓
7. Twig renders with context
   ↓
8. HTML sent to browser
```

### Context Building

```php
// 1. Start with Timber's base context
$context = Timber::context();
// Contains: site, theme, request, etc.

// 2. Context providers add data
$context = MenuContextProvider->addToContext($context);
// Adds: menus

$context = SecurityContextProvider->addToContext($context);
// Adds: nonce

$context = AssetsContextProvider->addToContext($context);
// Adds: theme_logo, etc.

// 3. Template adds specific data
$context['posts'] = Timber::get_posts();

// 4. Render with complete context
Timber::render('pages/Index.twig', $context);
```

## Dependency Management

### Composer (PHP Dependencies)

**File**: `composer.json`

```json
{
  "autoload": {
    "psr-4": {
      "BYSPress\\": "inc/"
    },
    "classmap": ["components/"]
  }
}
```

**How It Works**:
- Classes in `inc/` are autoloaded via PSR-4
- Namespace `BYSPress` maps to `inc/` directory
- Component classes are autoloaded via classmap
- No `require` statements needed

**Example**:
```php
// File: inc/Security/NonceManager.php
namespace BYSPress\Security;

class NonceManager { }

// Usage: (no require needed!)
use BYSPress\Security\NonceManager;
$nonce = new NonceManager();
```

### NPM (Node Dependencies)

**File**: `package.json`

Frontend dependencies managed by npm:
- Vite (build tool)
- TypeScript (type checking)
- Vue 3 (components)
- ESLint, Prettier (code quality)

## Hooks System

### Actions

```php
// Fired when theme is fully booted
do_action('bys_press_booted', $theme);

// Fired when all utilities are loaded
do_action('bys_press_utilities_loaded', $utilities);

// Fired for each utility loaded
do_action('bys_press_utility_loaded', $name, $file);
```

### Filters

```php
// Modify Timber context
$context = apply_filters('bys_press_timber_context', $context);

// Modify CSP directives
$directives = apply_filters('bys_press_csp_directives', $directives, $nonce);

// Modify Permissions Policy
$permissions = apply_filters('bys_press_permissions_policy', $permissions);
```

## Naming Conventions

### PHP

| Type | Convention | Example |
|------|-----------|---------|
| **Namespace** | PascalCase | `BYSPress\Security` |
| **Class** | PascalCase | `ContentSecurityPolicy` |
| **Method** | camelCase | `addToContext()` |
| **Property** | camelCase | `$contextProviders` |
| **Constant** | SCREAMING_SNAKE | `MAX_RETRIES` |

### Hooks

| Type | Convention | Example |
|------|-----------|---------|
| **Action** | snake_case | `bys_press_booted` |
| **Filter** | snake_case | `bys_press_timber_context` |
| **Prefix** | bys_press_ | Always use theme prefix |

### Files

| Type | Convention | Example |
|------|-----------|---------|
| **Class File** | PascalCase.php | `ThemeSetup.php` |
| **Config File** | lowercase.php | `menu.php` |
| **Utility File** | camelCase.php | `disableEmojis.php` |
| **Twig File** | PascalCase.twig | `Button.twig` |

## Twig Template Locations

```
Timber searches in order:
1. components/     # Reusable components
2. layouts/        # Page layouts
3. pages/          # Full page templates
```

**Example**:
```php
// Searches: components/, layouts/, pages/
Timber::render('Button/Button.twig', $context);

// Explicit subdirectory
Timber::render('pages/Index/Index.twig', $context);
```

## Extending the Theme

### Adding a New Component

See [Components Guide](./components.md)

### Adding a Context Provider

1. Create class implementing `ContextProviderInterface`
2. Register in `TimberConfig::registerContextProviders()`

```php
namespace BYSPress\Context\Providers;

use BYSPress\Context\ContextProviderInterface;

class MyContextProvider implements ContextProviderInterface {
    public function addToContext(array $context): array {
        $context['my_data'] = 'value';
        return $context;
    }
}
```

### Adding a Utility

1. Create PHP file in `inc/utilities/`
2. Add your code (no class required)
3. Automatically loaded by `UtilitiesManager`

```php
<?php
// inc/utilities/myUtility.php

add_action('init', function() {
    // Your code here
});
```

## Performance Considerations

### Production Optimizations

| Feature | Development | Production |
|---------|------------|------------|
| **Timber Cache** | Disabled | Enabled |
| **Security Headers** | Disabled | Enabled |
| **Assets** | Dev server | Optimized dist/ |
| **Debug** | Verbose | Minimal |

### Asset Loading Strategy

1. **Critical CSS** - Inlined in `<head>`
2. **Main CSS** - Loaded with preload hint
3. **Scripts** - Deferred for non-blocking load
4. **Fonts** - Preloaded for faster rendering
5. **Images** - Lazy loaded (via Timber)

## Testing

### Unit Tests

PHP classes are designed for testability:
- Constructor injection for dependencies
- No global state
- Single responsibilities

```php
// Test example
$mockSecurity = $this->createMock(Security::class);
$theme = new Theme(null, null, $mockSecurity);
$theme->boot();
```

### Integration Tests

Test Timber rendering:
```php
$context = ['name' => 'Test'];
$output = Timber::compile('Button/Button.twig', $context);
$this->assertStringContainsString('Test', $output);
```

## Best Practices

1. **Never modify `functions.php`** - Add code in classes
2. **Use namespace imports** - Always `use` classes
3. **Follow PSR-4** - File location matches namespace
4. **Single responsibility** - One purpose per class
5. **Type hints** - Always declare types
6. **Context providers** - Don't pollute Theme class
7. **Hooks over direct calls** - Use WordPress hooks
8. **Document public methods** - PHPDoc required

## Common Patterns

### Accessing Theme Instance

```php
// From anywhere
$theme = bys_press();
$security = $theme->getSecurity();
$nonce = $security->getNonce();
```

### Adding to Timber Context

```php
// In template file
$context = Timber::context();
$context['my_data'] = 'value';
Timber::render('MyTemplate.twig', $context);
```

### Hooking into Theme

```php
// In your plugin or child theme
add_action('bys_press_booted', function($theme) {
    // Extend theme functionality
});
```

---

**Next**: Learn about [Timber & Twig](./timber-twig.md) for templating.
