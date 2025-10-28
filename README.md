# Core Theme

A modern, secure WordPress theme built with professional development practices and cutting-edge tooling. Core Theme provides a minimal yet powerful foundation for building high-performance WordPress sites with modern JavaScript frameworks, type safety, and developer-friendly workflows.

## Philosophy & Vision

Core Theme was designed with a clear philosophy:

**Developer Experience First**: Modern tooling shouldn't be a luxury. This theme brings Vite's lightning-fast HMR, TypeScript's type safety, and Vue's progressive framework to WordPress development.

**Security by Default**: Security isn't an afterthought. Core Theme implements comprehensive security headers, Content Security Policy, REST API hardening, and WordPress security best practices out of the box.

**Clean Architecture**: Maintainability matters. With PSR-4 autoloading, modular PHP classes, separation of concerns, and a clear directory structure, the codebase stays organized as it grows.

**Performance-Focused**: Speed is a feature. Optimized builds, lazy loading, minimal dependencies, and semantic HTML ensure your site loads fast and stays fast.

**Accessibility-First**: The web should be for everyone. Semantic HTML5, skip navigation, ARIA landmarks, and keyboard navigation support are built into the foundation.

## Tech Stack

### Backend
- **WordPress** (6.0+) - Content management system
- **Timber** (2.3+) - Twig templating engine for clean view separation
- **PHP 8.1+** - Modern PHP with type declarations and strict typing
- **Composer** - PHP dependency management and PSR-4 autoloading

### Frontend
- **Vite** (7.x) - Next-generation frontend tooling with instant HMR
- **TypeScript** (5.x) - Type safety across JavaScript codebase
- **Vue 3** - Progressive JavaScript framework with Composition API
- **CSS Custom Properties** - Modern CSS with BEM methodology

### Development & Testing
- **Vitest** - Fast unit testing with UI and coverage reports
- **PHPUnit** - PHP unit testing with Brain Monkey for WordPress mocks
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Git** - Version control

## Key Features

### Modern Development Workflow
- Hot Module Replacement (HMR) for instant updates during development
- TypeScript for type-safe JavaScript development
- Vue 3 components with Composition API and reactive state management
- Vite for optimized production builds
- Environment-aware configuration with .env support

### WordPress Integration
- Twig templating via Timber for clean separation of logic and views
- Modular template structure (layouts, pages, partials)
- WordPress theme support (menus, thumbnails, feeds, custom logo)
- Custom post type and taxonomy ready
- REST API with security hardening

### Security Implementation
- Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
- Content Security Policy with nonce-based script execution
- REST API authentication and endpoint restrictions
- File editing protection in production
- Environment-specific security configurations
- Input sanitization and output escaping

### Code Quality & Testing
- PHPUnit tests for PHP components
- Vitest tests for JavaScript/TypeScript code
- Vue component testing with Testing Library
- Code coverage reporting
- ESLint for code quality
- Prettier for consistent formatting

### Error Handling & Reliability
- Centralized error handler utility with severity levels
- ErrorBoundary component for Vue applications
- Global error and promise rejection handlers
- Development-friendly error logging
- Production-ready error tracking integration
- User-friendly error messages and fallback UI

### Performance Optimizations
- Optimized Vite builds with code splitting
- Lazy loading for images and components
- Minimal JavaScript footprint
- Efficient CSS with custom properties
- Production asset optimization

### Accessibility
- Semantic HTML5 structure
- Skip navigation links
- ARIA landmarks
- Keyboard navigation support
- Screen reader friendly

## Installation

### Prerequisites
- PHP 8.1 or higher
- WordPress 6.0 or higher
- Node.js 18+ and npm
- Composer

### Setup Steps

1. **Clone or download the theme**
   ```bash
   cd wp-content/themes
   git clone https://github.com/tadeasthelen/core-theme.git
   cd core-theme
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your local development URL:
   ```
   WP_HOME=http://your-local-site.test
   VITE_DEV_SERVER_URL=http://localhost:5173
   ```

5. **Activate the theme**
   - Go to WordPress Admin > Appearance > Themes
   - Activate "Core Theme"

6. **Install Timber plugin** (optional, Composer version is used by default)
   - The theme includes Timber via Composer
   - Alternatively, install the Timber plugin from WordPress.org

## Development

### Available Commands

**Development**
```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
```

**Testing**
```bash
npm test             # Run Vitest in watch mode
npm run test:ui      # Launch Vitest UI
npm run test:run     # Run tests once
npm run test:coverage # Generate coverage report
npm run test:php     # Run PHPUnit tests
npm run test:all     # Run all tests (Vitest + PHPUnit)
```

**Code Quality**
```bash
npm run lint         # Check JavaScript/TypeScript code
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run check        # Run lint + format check
```

**PHP Testing**
```bash
composer test        # Run PHPUnit tests
composer test:coverage # Generate PHP coverage report
```

### Development Workflow

1. **Start development server**
   ```bash
   npm run dev
   ```
   This starts Vite dev server on `http://localhost:5173` with HMR enabled.

2. **Make your changes**
   - Edit PHP files in `inc/` for backend logic
   - Edit Twig templates in `components/`, `layouts/`, or `pages/`
   - Edit TypeScript/JavaScript in `lib/`
   - Edit Vue components in `components/`
   - Edit CSS in component folders (auto-discovered)

3. **See changes instantly**
   - PHP and Twig changes: Refresh the browser
   - JavaScript/CSS/Vue changes: Updates instantly via HMR

4. **Write tests**
   - Add Vitest tests alongside components/composables
   - Add PHPUnit tests for PHP classes in `tests/`

5. **Build for production**
   ```bash
   npm run build
   ```
   Creates optimized assets in `dist/` directory.

## Project Structure

```
core-theme/
├── components/            # All components (Twig + Vue)
│   ├── Button/           # Twig component
│   │   ├── Button.twig   # Template
│   │   ├── Button.css    # Styles
│   │   └── Button.php    # Context helper
│   ├── Counter/          # Vue component
│   │   ├── Counter.vue   # Component
│   │   └── Counter.types.ts
│   ├── Card/
│   ├── Header/
│   └── Footer/
├── composables/          # Vue composables
│   └── useCounter/
│       ├── useCounter.ts
│       ├── useCounter.types.ts
│       └── index.ts
├── layouts/              # Page layouts
│   └── Base/
│       ├── Base.twig     # Base HTML structure
│       └── Base.css      # Layout styles
├── pages/                # Page templates
│   ├── FrontPage/
│   │   ├── FrontPage.twig
│   │   └── FrontPage.css
│   └── Index/
│       └── Index.twig
├── lib/                  # TypeScript/JavaScript source
│   ├── main.ts          # Main entry point
│   ├── config.ts        # Theme configuration
│   ├── vite-env.d.ts    # Type definitions
│   ├── config/
│   │   └── vueAutoload.ts  # Vue auto-discovery
│   └── utils/
│       └── errorHandler.ts
├── styles/               # Global base styles
│   ├── base/
│   │   ├── reset.css
│   │   └── typography.css
│   ├── utilities/
│   │   └── utilities.css
│   └── main.css         # Global styles entry
├── config/               # Theme configuration
│   └── tokens.css       # Design tokens
├── inc/                  # PHP classes (PSR-4: CoreTheme\)
│   ├── Theme.php        # Main orchestrator
│   ├── ThemeSetup.php   # WordPress support
│   ├── Assets.php       # Vite integration
│   ├── Security.php     # Security headers
│   └── TimberConfig.php # Timber configuration
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md  # Architecture guide
│   ├── COMPONENTS.md    # Component guide
│   ├── VUE_COMPONENTS.md # Vue guide
│   ├── AUTOLOADING.md   # Auto-loading guide
│   └── SECURITY.md      # Security policy
├── dist/                 # Built assets (generated)
├── tests/                # PHPUnit tests
├── vendor/               # PHP dependencies (Composer)
├── node_modules/         # Node dependencies (npm)
├── .env                  # Environment config (not in git)
├── .env.example          # Environment template
├── composer.json         # PHP dependencies
├── package.json          # Node dependencies
├── vite.config.js        # Vite configuration
├── vitest.config.ts      # Vitest configuration
├── phpunit.xml           # PHPUnit configuration
├── eslint.config.js      # ESLint configuration
├── tsconfig.json         # TypeScript configuration
├── functions.php         # Theme bootstrap
├── front-page.php        # Front page template
├── index.php             # Fallback template
├── style.css             # Theme header (required)
├── screenshot.png        # Theme screenshot
└── README.md             # This file
```

## Architecture

### PHP Architecture (Object-Oriented)

Core Theme uses a modular, OOP architecture with PSR-4 autoloading:

- **Theme.php**: Main orchestrator that initializes all components
- **ThemeSetup.php**: WordPress theme support and features
- **Assets.php**: Vite integration, asset enqueuing with integrity checking
- **Security.php**: Security headers, CSP, REST API hardening
- **TimberConfig.php**: Timber/Twig configuration and customization

All classes are in the `CoreTheme\` namespace and autoloaded via Composer.

### Frontend Architecture

- **Entry Point**: `src/js/main.ts` imports all necessary modules
- **Components**: Vue 3 components in `src/components/`
- **Styles**: Modular CSS with BEM methodology
- **Build Tool**: Vite compiles everything into `dist/`

### Template Architecture (Twig/Timber)

- **Layouts**: Base templates with blocks for content
- **Pages**: Specific page templates
- **Partials**: Reusable template components
- **Separation**: Logic in PHP, presentation in Twig

## Environment Configuration

Core Theme uses environment variables for configuration:

```env
# WordPress Home URL
WP_HOME=http://your-site.test

# Vite Dev Server
VITE_DEV_SERVER_URL=http://localhost:5173
```

See [md-docs/ENV_USAGE.md](md-docs/ENV_USAGE.md) for detailed configuration options.

## Security

Core Theme implements comprehensive security measures:

- Content Security Policy (CSP) with nonce-based script execution
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- REST API authentication and endpoint restrictions
- File editing disabled in production
- Environment-aware security configurations

See [docs/SECURITY.md](docs/SECURITY.md) for detailed security documentation.

## Testing

### JavaScript/TypeScript Testing
```bash
npm test              # Watch mode
npm run test:ui       # UI interface
npm run test:coverage # Coverage report
```

### PHP Testing
```bash
composer test         # Run PHPUnit
composer test:coverage # Coverage report
```

See [md-docs/TESTING.md](md-docs/TESTING.md) for comprehensive testing guide.

## Customization

Want to add new pages, styles, functionality, or integrate libraries?

See [md-docs/CUSTOMIZE.md](md-docs/CUSTOMIZE.md) for a complete customization tutorial.

## Error Handling

Core Theme includes a robust error handling system:

- Centralized error handler with severity levels
- ErrorBoundary component for Vue
- Global error and promise rejection handlers
- Development vs production error logging
- Integration ready for error tracking services (Sentry, etc.)

See [md-docs/ERROR_HANDLING.md](md-docs/ERROR_HANDLING.md) for the complete error handling guide.

## Performance

Core Theme is optimized for performance:

- Vite's optimized production builds
- Code splitting and tree shaking
- Minimal JavaScript footprint
- Efficient CSS architecture
- Lazy loading ready

See [md-docs/PERFORMANCE.md](md-docs/PERFORMANCE.md) for optimization techniques.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript features
- CSS Custom Properties

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

GNU General Public License v2 or later. See [LICENSE](license.txt).

## Support

- **Issues**: [GitHub Issues](https://github.com/tadeasthelen/core-theme/issues)
- **Documentation**: [md-docs/](md-docs/)
- **Author**: Tadeas Thelen - [tadeasthelen.com](https://tadeasthelen.com)

## Credits

Built with:
- [WordPress](https://wordpress.org/)
- [Timber](https://timber.github.io/docs/)
- [Vite](https://vitejs.dev/)
- [Vue](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [@kucrut/vite-for-wp](https://github.com/kucrut/vite-for-wp)

---

**Core Theme** - Modern WordPress development foundation
