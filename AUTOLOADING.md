# Complete Autoloading System

## Overview

Core Theme uses a **fully automatic component loading system**. When you create a new component, all its files are automatically discovered and loaded:

- **Twig templates** - Auto-discovered by Timber
- **CSS styles** - Auto-discovered by Vite
- **PHP classes** - Auto-discovered by Composer
- **TypeScript behaviors** - Auto-discovered by Vite

**No manual imports or configuration needed!**

## Component Structure

```
components/ComponentName/
  ├── ComponentName.twig  # Template (Timber auto-discovers)
  ├── ComponentName.css   # Styles (Vite auto-loads)
  ├── ComponentName.php   # Helper (Composer autoloads)
  └── ComponentName.ts    # Behavior (Vite auto-loads)
```

## How It Works

### 1. Twig Templates (Timber)

**Configuration:** `inc/TimberConfig.php`
```php
Timber::$dirname = ['components', 'layouts', 'pages'];
```

**Usage:**
```twig
{% include 'ComponentName/ComponentName.twig' %}
```

Timber automatically searches all configured directories.

### 2. CSS Styles (Vite)

**Configuration:** `lib/main.ts`
```typescript
const _componentStyles = import.meta.glob('../components/**/*.css', { eager: true });
const _layoutStyles = import.meta.glob('../layouts/**/*.css', { eager: true });
const _pageStyles = import.meta.glob('../pages/**/*.css', { eager: true });
```

**How it works:**
- Vite's `import.meta.glob` scans for all `.css` files
- `eager: true` bundles them into `main.css`
- Create `ComponentName.css` → automatically included

### 3. PHP Classes (Composer)

**Configuration:** `composer.json`
```json
{
  "autoload": {
    "classmap": ["components/"]
  }
}
```

**How it works:**
- Composer scans all PHP files in `components/`
- Classes are automatically registered
- Use `composer dump-autoload` after adding new PHP files

**Usage:**
```php
use CoreTheme\Components\Alert;

$alert = Alert::success('Message');
```

### 4. TypeScript Behaviors (Vite + Auto-init)

**Configuration:** `lib/main.ts`
```typescript
const componentBehaviors = import.meta.glob('../components/**/*.ts', { eager: true });

function initComponentBehaviors(): void {
  Object.entries(componentBehaviors).forEach(([path, module]) => {
    if (module?.initAll) {
      module.initAll();
    }
  });
}
```

**How it works:**
- Vite loads all `.ts` files from components
- Auto-init calls `initAll()` on each module
- Components initialize their own behavior

**Component pattern:**
```typescript
// components/Alert/Alert.ts
export class Alert {
  static initAll(): void {
    const alerts = document.querySelectorAll('[data-component="alert"]');
    alerts.forEach(el => new Alert(el));
  }
}
```

## Complete Example: Alert Component

### Step 1: Create Directory
```bash
mkdir -p components/Alert
```

### Step 2: Create Files

**Alert.twig**
```twig
<div class="{{ classes }}" data-component="alert">
  <span class="alert__message">{{ message }}</span>
</div>
```

**Alert.css**
```css
.alert {
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

.alert--success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}
```

**Alert.php**
```php
<?php
namespace CoreTheme\Components;

class Alert {
    public static function success(string $message): array {
        return [
            'message' => $message,
            'classes' => 'alert alert--success',
        ];
    }
}
```

**Alert.ts**
```typescript
export class Alert {
  constructor(private element: HTMLElement) {
    this.init();
  }

  private init(): void {
    // Add close button, auto-dismiss, etc.
  }

  static initAll(): void {
    const alerts = document.querySelectorAll<HTMLElement>('[data-component="alert"]');
    alerts.forEach(el => new Alert(el));
  }
}
```

### Step 3: Regenerate Autoloader (for PHP only)
```bash
composer dump-autoload
```

### Step 4: Build
```bash
npm run build
```

**Done!** All files are automatically loaded.

### Step 5: Use Component

**In PHP:**
```php
use CoreTheme\Components\Alert;

$context['alert'] = Alert::success('It works!');
Timber::render('page.twig', $context);
```

**In Twig:**
```twig
{% include 'Alert/Alert.twig' with alert %}
```

## Verification

After creating a new component, verify autoloading:

### Check CSS
```bash
npm run build
# Look for your component in dist/css/main.css
```

### Check TypeScript
```bash
npm run build
# Look for your component in dist/js/main.js
# Check browser console for init logs
```

### Check PHP
```bash
composer dump-autoload
# Try using the class
```

### Check Twig
```php
// Just use it - Timber finds it automatically
{% include 'YourComponent/YourComponent.twig' %}
```

## Benefits

✅ **Zero configuration** - Create files, they're automatically loaded
✅ **Fast development** - No manual imports to manage
✅ **Scalable** - Add 100 components, system handles it
✅ **Type-safe** - TypeScript + PHP classes
✅ **Performance** - Everything bundled optimally
✅ **Maintainable** - Clear, predictable structure

## File Checklist

When creating a new component:

- [ ] Create `components/ComponentName/` directory
- [ ] Add `ComponentName.twig` (always required)
- [ ] Add `ComponentName.css` (auto-loads)
- [ ] Add `ComponentName.php` (auto-loads, run `composer dump-autoload`)
- [ ] Add `ComponentName.ts` (auto-loads, export `initAll()` static method)
- [ ] Run `npm run build`
- [ ] Test component in browser

## Debugging

### CSS not loading?
```bash
npm run build
# Check dist/css/main.css file size - should increase
```

### TypeScript not initializing?
```javascript
// Check browser console
// Look for "Initialized behavior:" logs
```

### PHP class not found?
```bash
composer dump-autoload
# Check if class appears in vendor/composer/autoload_classmap.php
```

### Twig template not found?
```php
// Check Timber directories
error_log(print_r(Timber\Timber::$dirname, true));
// Should show: ['components', 'layouts', 'pages']
```

## Advanced: Lazy Loading

For large components, use lazy loading:

```typescript
// Don't use import.meta.glob for specific large components
// Instead, lazy load them:
const heavyComponent = () => import('../components/Heavy/Heavy');
```

## Summary

**Component-first architecture with complete autoloading:**

1. **Create component files** in their folder
2. **Run build** (npm + composer if PHP)
3. **Use component** - everything just works!

No configuration, no manual imports, no hassle. 🎉
