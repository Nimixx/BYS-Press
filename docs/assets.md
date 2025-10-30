# Assets Management

BYS Press uses Vite for modern asset management with Hot Module Replacement (HMR), TypeScript, and optimized production builds.

## Overview

**Assets Pipeline**:
```
src/main.ts  →  Vite  →  dist/main.[hash].js
src/main.css →  Vite  →  dist/main.[hash].css
```

**Key Features**:
- Hot Module Replacement (HMR)
- TypeScript compilation
- CSS preprocessing
- Code splitting
- Asset optimization
- Hash-based cache busting

## Vite Configuration

**File**: `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [
    vue(),
    ViteForWp({
      input: {
        main: 'src/main.ts',
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
```

## Entry Points

### JavaScript Entry

**File**: `src/main.ts`

```typescript
// Import styles
import './main.css';

// Import Vue components
import { createApp } from 'vue';
import ExampleComponent from './components/ExampleComponent.vue';

// Initialize app
const app = createApp({});
app.component('ExampleComponent', ExampleComponent);
app.mount('#app');

// Your code
console.log('Theme loaded');
```

### CSS Entry

**File**: `src/main.css`

```css
/* Import component styles */
@import '../components/Button/Button.css';
@import '../components/Alert/Alert.css';

/* Global styles */
:root {
  --color-primary: #0073aa;
  --color-secondary: #23282d;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.5;
}
```

## Asset Enqueuing

**Class**: `BYSPress\Assets\AssetEnqueuer`

Assets are automatically enqueued via Vite for WP:

```php
public function init(): void
{
    add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
}

public function enqueueAssets(): void
{
    // Vite handles enqueuing based on manifest.json
    vite_enqueue_script('main', 'src/main.ts');
}
```

## Script Optimization

**Class**: `BYSPress\Assets\ScriptOptimizer`

### Defer Scripts

```php
// Add to functions.php or custom code
add_action('bys_press_booted', function($theme) {
    $assets = $theme->getAssets();
    $assets->addDeferredScript('my-script-handle');
});
```

### Async Scripts

```php
add_action('bys_press_booted', function($theme) {
    $assets = $theme->getAssets();
    $assets->addAsyncScript('analytics-script');
});
```

## Style Optimization

**Class**: `BYSPress\Assets\StyleOptimizer`

### Font Display Optimization

Automatically adds `font-display: swap` to improve load performance.

### Disable Font Optimization

```php
add_action('bys_press_booted', function($theme) {
    $assets = $theme->getAssets();
    $assets->setFontOptimization(false);
});
```

## Critical CSS

**Class**: `BYSPress\Assets\CriticalCssHandler`

### Set Critical CSS

```php
add_action('bys_press_booted', function($theme) {
    $criticalCss = '
        body { margin: 0; }
        .header { background: #000; }
    ';
    $theme->getAssets()->setCriticalCss($criticalCss);
});
```

Critical CSS is inlined in `<head>` for faster initial render.

## Resource Hints

**Class**: `BYSPress\Assets\ResourceHints`

### Preload Assets

```php
add_action('bys_press_booted', function($theme) {
    $assets = $theme->getAssets();

    // Preload font
    $assets->addPreloadResource(
        get_theme_file_uri('fonts/custom-font.woff2'),
        'font',
        ['as' => 'font', 'type' => 'font/woff2', 'crossorigin' => true]
    );

    // Preload image
    $assets->addPreloadResource(
        get_theme_file_uri('images/hero.jpg'),
        'image',
        ['as' => 'image']
    );
});
```

## TypeScript

### Configuration

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true
  }
}
```

### Usage

```typescript
// Type-safe code
interface User {
  id: number;
  name: string;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}

// Type checking prevents errors
greetUser({ id: 1, name: 'John' }); // ✅ OK
greetUser({ name: 'John' });         // ❌ Error: missing 'id'
```

## Vue 3 Components

### Creating Component

**File**: `src/components/Counter.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
const increment = () => count.value++;
</script>

<template>
  <div class="counter">
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<style scoped>
.counter {
  padding: 1rem;
  border: 1px solid #ddd;
}
</style>
```

### Using Component

```typescript
// src/main.ts
import { createApp } from 'vue';
import Counter from './components/Counter.vue';

const app = createApp({});
app.component('Counter', Counter);
app.mount('#app');
```

```twig
{# In Twig template #}
<div id="app">
  <Counter />
</div>
```

## Development vs Production

### Development Mode

```bash
npm run dev
```

- Assets served from `http://localhost:5173`
- Hot Module Replacement
- Source maps
- Fast rebuilds
- No minification

### Production Mode

```bash
npm run build
```

- Assets built to `dist/`
- Minified and optimized
- Cache busting hashes
- Tree shaking
- Code splitting

## Code Splitting

Vite automatically splits code for better performance:

```typescript
// Dynamic import - creates separate chunk
const Component = () => import('./HeavyComponent.vue');

// Route-based splitting
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue'),
  },
];
```

## Image Optimization

### Using in TypeScript

```typescript
import logoUrl from './logo.png';

const img = document.createElement('img');
img.src = logoUrl;
```

### Using in Twig

```twig
<img src="{{ theme.link }}/dist/assets/logo.png" alt="Logo">
```

### Lazy Loading

```twig
<img
  src="{{ post.thumbnail.src('large') }}"
  loading="lazy"
  alt="{{ post.title }}"
>
```

## Best Practices

1. **Use `import` for assets** - Let Vite handle them
2. **Keep entry points small** - Dynamic import large components
3. **Optimize images** - Compress before adding to theme
4. **Use source maps** - Easier debugging
5. **Test production builds** - Before deploying
6. **Monitor bundle size** - Keep it reasonable
7. **Leverage caching** - Hashed filenames for cache busting

## Performance Tips

- Defer non-critical scripts
- Preload critical fonts
- Use Critical CSS for above-the-fold content
- Enable font-display: swap
- Lazy load images and components
- Code split large bundles
- Remove unused CSS/JS

## Troubleshooting

### Assets Not Loading

1. Check dev server: `npm run dev`
2. Verify `dist/manifest.json` exists
3. Clear browser cache
4. Check browser console

### HMR Not Working

1. Restart dev server
2. Check `localhost:5173` is accessible
3. Hard refresh browser
4. Check for errors in terminal

---

**Next**: Learn about [Utilities](./utilities.md) for WordPress optimizations.
