# BYS Press Documentation

Welcome to the BYS Press theme documentation. This guide is designed to help developers understand and work with the theme effectively.

## 📚 Documentation Structure

### Core Concepts
1. **[Getting Started](./getting-started.md)** - Installation, setup, and first steps
2. **[Architecture](./architecture.md)** - Theme structure, design patterns, and organization
3. **[Development Workflow](./development.md)** - Daily development tasks and best practices

### Features & Functionality
4. **[Timber & Twig](./timber-twig.md)** - Template engine usage and context management
5. **[Components](./components.md)** - Creating and using reusable components
6. **[Assets Management](./assets.md)** - Vite, TypeScript, Vue 3, and asset optimization
7. **[Security Features](./security.md)** - Security headers, CSP, and hardening

### Reference
8. **[Utilities](./utilities.md)** - Utility modules and WordPress optimizations
9. **[Configuration](./configuration.md)** - Environment setup and configuration options

## 🎯 Quick Navigation

### For New Developers
Start here to understand the theme:
1. Read [Architecture](./architecture.md) to understand how everything fits together
2. Follow [Getting Started](./getting-started.md) to set up your environment
3. Review [Development Workflow](./development.md) for daily tasks
4. Explore [Timber & Twig](./timber-twig.md) for templating

### For AI/LLM Understanding
Key files to understand the codebase:
- **Entry Point**: `functions.php` - Theme bootstrap
- **Main Class**: `inc/Theme.php` - Core orchestrator
- **Structure**: See [Architecture](./architecture.md)
- **Patterns**: Object-oriented, dependency injection, PSR-4 autoloading

## 🏗️ Theme Overview

**BYS Press** is a modern WordPress theme built with:
- **Timber/Twig** for clean template separation
- **Vite** for fast builds and hot module replacement
- **TypeScript** for type-safe JavaScript
- **Vue 3** for reactive components
- **Security-first** approach with CSP and security headers
- **Performance optimized** with minimal dependencies

### Key Principles
1. **Separation of Concerns** - Logic in PHP, presentation in Twig
2. **Object-Oriented** - Clean classes with single responsibilities
3. **Security by Default** - Production-ready security headers
4. **Developer Experience** - Fast builds, hot reload, type safety
5. **Performance First** - Optimized assets and minimal overhead

## 🔍 Theme Structure

```
bys-press/
├── inc/                    # PHP classes (PSR-4 autoloaded)
│   ├── Assets/            # Asset management (Vite, optimization)
│   ├── Context/           # Timber context providers
│   ├── Security/          # Security features (CSP, headers)
│   ├── Config/            # Configuration files
│   ├── utilities/         # WordPress optimization utilities
│   ├── Theme.php          # Main theme class
│   ├── ThemeSetup.php     # Theme supports and menus
│   ├── TimberConfig.php   # Timber configuration
│   └── Security.php       # Security orchestrator
├── components/            # Reusable Twig components
│   └── */                # Each component has PHP helper + Twig template
├── layouts/               # Twig layout templates
├── pages/                 # Twig page templates
├── src/                   # Frontend assets (TypeScript, CSS, Vue)
├── dist/                  # Built assets (generated)
├── functions.php          # Theme entry point
└── style.css             # Theme header and metadata
```

## 🚀 Key Features

### Modern Development Stack
- **Vite** - Lightning-fast builds with HMR
- **TypeScript** - Type-safe JavaScript development
- **Vue 3** - Reactive component framework
- **Timber/Twig** - Clean template separation
- **Composer** - PHP dependency management

### Security Features
- Content Security Policy (CSP) with nonces
- Security headers (HSTS, X-Frame-Options, etc.)
- Permissions Policy for browser features
- WordPress hardening (REST API, file editing, etc.)
- User enumeration prevention

### Performance Optimization
- Critical CSS inlining
- Script defer/async handling
- Resource hints (preload, dns-prefetch)
- Font optimization
- Minimal dependencies (~100KB lighter)

### Developer Experience
- Hot module replacement in development
- Type checking with TypeScript
- Code formatting with Prettier
- Linting with ESLint
- Automated testing setup

## 📖 Learning Path

### Day 1: Understanding the Basics
1. Read [Architecture](./architecture.md) - 15 min
2. Read [Timber & Twig](./timber-twig.md) - 20 min
3. Follow [Getting Started](./getting-started.md) - 30 min
4. Explore `inc/Theme.php` and `functions.php`

### Day 2: Building Features
1. Read [Components](./components.md) - 20 min
2. Read [Assets Management](./assets.md) - 15 min
3. Read [Development Workflow](./development.md) - 15 min
4. Create your first component

### Day 3: Advanced Topics
1. Read [Security Features](./security.md) - 20 min
2. Read [Utilities](./utilities.md) - 15 min
3. Customize security headers
4. Enable/disable utilities as needed

## 🤖 AI/LLM Quick Reference

### Theme Identity
- **Namespace**: `BYSPress`
- **Text Domain**: `bys-press`
- **Function Prefix**: `bys_press()`
- **Hook Prefix**: `bys_press_`

### Main Classes
```php
BYSPress\Theme              // Main orchestrator
BYSPress\ThemeSetup         // WordPress theme supports
BYSPress\TimberConfig       // Timber/Twig setup
BYSPress\Security           // Security features
BYSPress\Assets             // Asset management
```

### Key Actions/Filters
```php
// Actions
do_action('bys_press_booted', $theme);
do_action('bys_press_utilities_loaded', $utilities);
do_action('bys_press_utility_loaded', $name, $file);

// Filters
apply_filters('bys_press_timber_context', $context);
apply_filters('bys_press_csp_directives', $directives, $nonce);
apply_filters('bys_press_permissions_policy', $permissions);
```

### File Locations
- **Templates**: `layouts/`, `pages/`, `components/`
- **PHP Logic**: `inc/`
- **Frontend Code**: `src/`
- **Built Assets**: `dist/`
- **Utilities**: `inc/utilities/`

## 🔗 External Resources

- [Timber Documentation](https://timber.github.io/docs/)
- [Twig Documentation](https://twig.symfony.com/doc/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
- [WordPress Theme Handbook](https://developer.wordpress.org/themes/)

## 💡 Need Help?

1. Check the relevant documentation page above
2. Look at existing components in `components/` for examples
3. Review `inc/Theme.php` to understand the boot process
4. Examine context providers in `inc/Context/Providers/`

---

**Next Steps**: Start with [Getting Started](./getting-started.md) to set up your development environment.
