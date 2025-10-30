# BYS Press

A modern WordPress theme built with Timber/Twig, Vite, TypeScript, and Vue 3.

## Requirements

- PHP 8.1+
- WordPress 6.0+
- Node.js 18+
- Composer

## Installation

```bash
cd wp-content/themes/
git clone https://github.com/Nimixx/BYS-WP-Theme.git bys-press
cd bys-press
composer install
npm install
npm run build
```

Activate the theme in WordPress admin.

## Development

```bash
npm run dev       # Start development server with HMR
npm run build     # Build for production
npm run test      # Run tests
npm run check     # Lint and format check
```

## Directory Structure

```
bys-press/
├── components/       # Reusable components (Twig + Vue)
├── layouts/          # Base layouts
├── pages/            # Page templates
├── lib/              # TypeScript/JavaScript
├── styles/           # Global CSS
├── inc/              # PHP classes (PSR-4)
│   ├── Assets/       # Asset management
│   ├── Context/      # Timber context providers
│   ├── Security/     # Security components
│   └── utilities/    # Modular utilities
├── config/           # Configuration
├── dist/             # Production build (generated)
├── functions.php     # Theme bootstrap
└── style.css         # Theme header
```

## Architecture

### Component Structure

Each component contains its template, styles, and logic:

```
components/
├── Header/
│   ├── Header.twig
│   ├── Header.css
│   └── elements/
└── Menu/
    ├── Menu.twig
    ├── Menu.css
    └── index.ts
```

Usage in templates:

```twig
{% include 'Header/Header.twig' with { ... } %}
```

### Utilities System

The theme includes 24 modular utilities in `inc/utilities/`. Each utility is a standalone PHP file that auto-loads. To enable a utility, keep the file. To disable it, delete the file.

Categories:
- Security (7 utilities)
- Performance (8 utilities)
- Admin Cleanup (9 utilities)

See `inc/utilities/` directory for available utilities.

## Configuration

### Design Tokens

Edit `config/tokens.css` to customize colors, typography, and spacing:

```css
:root {
  --color-primary: #0066cc;
  --font-family-base: system-ui, sans-serif;
  --spacing-unit: 8px;
}
```

### WordPress Configuration

For production, add to `wp-config.php`:

```php
define('WP_ENVIRONMENT_TYPE', 'production');
define('WP_DEBUG', false);
define('DISALLOW_FILE_EDIT', true);
define('DISABLE_WP_CRON', true);  // Optional, requires system cron
```

## Testing

```bash
npm run test              # Frontend tests (Vitest)
npm run test:coverage     # Coverage report
composer test             # PHP tests (PHPUnit)
```

## Tech Stack

- WordPress 6.0+ with Timber 2.3+
- PHP 8.1+ with Composer
- Vite 7.x + TypeScript 5.x
- Vue 3 + CSS Custom Properties

## Documentation

- Component architecture: See `components/` directory
- Utilities documentation: See `inc/utilities/` directory
- Class documentation: PHPDoc blocks in `inc/` classes

## License

BSD Zero Clause License (0BSD) - See LICENSE file.
