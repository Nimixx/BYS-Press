# Performance Optimizations

This theme includes comprehensive performance optimizations for faster page loads and better Core Web Vitals scores.

## Script Loading Optimization

### Defer Scripts (Default)

By default, the main theme script is loaded with the `defer` attribute, which:
- Downloads scripts in parallel without blocking HTML parsing
- Executes scripts in order after HTML parsing completes
- Improves First Contentful Paint (FCP) and Largest Contentful Paint (LCP)

**Default configuration:**
```php
// inc/Assets.php:28
private array $deferredScripts = ['core-theme-main'];
```

### Adding More Deferred Scripts

```php
// In functions.php or via action hook
add_action('core_theme_booted', function($theme) {
    $assets = $theme->getAssets();

    // Add additional scripts to defer
    $assets->addDeferredScript('my-custom-script');
    $assets->addDeferredScript('analytics-script');
});
```

### Async Scripts

For truly independent scripts (like analytics), use async loading:

```php
add_action('core_theme_booted', function($theme) {
    $assets = $theme->getAssets();

    // Load Google Analytics asynchronously
    $assets->addAsyncScript('google-analytics');
});
```

**Difference between defer and async:**
- **defer**: Scripts execute in order after parsing (best for most scripts)
- **async**: Scripts execute immediately when loaded (best for independent scripts)

## Critical CSS

### What is Critical CSS?

Critical CSS is the minimal CSS needed to render above-the-fold content. Inlining it eliminates render-blocking CSS requests, improving FCP and LCP.

### Automatic Critical CSS Loading

If you create a `dist/critical.css` file, it will be automatically inlined in the `<head>`:

```bash
# Generate critical CSS (using a tool like critical)
npx critical src/index.html --base dist --inline > dist/critical.css
```

The theme automatically detects and inlines this file via `Assets::inlineCriticalCss()` - `inc/Assets.php:145`

### Manual Critical CSS

You can also set critical CSS programmatically:

```php
add_action('core_theme_booted', function($theme) {
    $assets = $theme->getAssets();

    $criticalCss = <<<CSS
body { margin: 0; font-family: sans-serif; }
header { background: #333; color: white; }
CSS;

    $assets->setCriticalCss($criticalCss);
});
```

### Recommended Workflow

1. **Development**: Don't worry about critical CSS
2. **Production**: Generate critical CSS as part of your build process
3. **Cache**: Critical CSS is read from file on each page load (consider caching)

## Font Optimization

### Font Display Strategy (Enabled by Default)

The theme automatically adds `display=swap` to Google Fonts, which:
- Shows fallback fonts immediately
- Swaps to web fonts when loaded
- Eliminates invisible text (FOIT)
- Improves perceived performance

**Implementation:** `inc/Assets.php:132-137`

### Font Preconnect

The theme automatically adds preconnect hints for Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin="anonymous">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
```

This establishes early connections to font CDNs, reducing latency.

**Implementation:** `inc/Assets.php:186-200`

### Disable Font Optimization

If you don't use Google Fonts:

```php
add_action('core_theme_booted', function($theme) {
    $theme->getAssets()->setFontOptimization(false);
});
```

## Resource Hints

### Preload Critical Resources

Preload important resources to load them with high priority:

```php
add_action('core_theme_booted', function($theme) {
    $assets = $theme->getAssets();

    // Preload hero image
    $assets->addPreloadResource(
        get_template_directory_uri() . '/dist/images/hero.jpg',
        'image'
    );

    // Preload critical font
    $assets->addPreloadResource(
        get_template_directory_uri() . '/dist/fonts/custom-font.woff2',
        'font',
        ['as' => 'font', 'crossorigin' => true]
    );

    // Preload critical JavaScript
    $assets->addPreloadResource(
        get_template_directory_uri() . '/dist/js/critical.js',
        'script'
    );
});
```

**Implementation:** `inc/Assets.php:163-177`

## Timber Template Caching

### Overview

Timber caching significantly improves performance by caching compiled Twig templates, reducing the overhead of template parsing and compilation on each request.

**Caching is automatically configured:**
- **Development (WP_DEBUG = true)**: Cache disabled for live template changes
- **Production (WP_DEBUG = false)**: Cache enabled automatically

**Implementation:** `inc/TimberConfig.php:85-111`

### How Timber Caching Works

Timber 2.x uses a simplified boolean cache setting:

- **Enabled (`true`)**: Timber automatically uses WordPress object cache if available (Redis, Memcached), otherwise falls back to WordPress transients
- **Disabled (`false`)**: No caching, templates are compiled on every request

The cache implementation is automatic - when enabled, Timber intelligently chooses the best available caching mechanism based on your WordPress setup.

### Customizing Cache Configuration

#### Disable Caching Programmatically

```php
add_action('core_theme_booted', function($theme) {
    $timberConfig = $theme->getTimberConfig();
    $timberConfig->setCacheEnabled(false);
});
```


### Clearing Cache

#### Clear All Timber Cache

```php
// Clear cached templates
$timberConfig = core_theme()->getTimberConfig();
$timberConfig->clearCache();
```

#### Clear Compiled Twig Cache

```php
// Clear compiled Twig templates from cache directory
$timberConfig = core_theme()->getTimberConfig();
$timberConfig->clearTwigCache();
```

#### Clear Cache on Theme Updates

```php
// Automatically clear cache when theme is updated
add_action('after_switch_theme', function() {
    $timberConfig = core_theme()->getTimberConfig();
    $timberConfig->clearCache();
    $timberConfig->clearTwigCache();
});
```

### Cache Performance Impact

**Without Timber Cache:**
- Templates parsed and compiled on every request
- ~50-200ms additional overhead per request
- Higher CPU usage

**With Timber Cache:**
- Templates compiled once, cached
- ~5-20ms overhead per request
- Significantly lower CPU usage
- Better for high-traffic sites

### Best Practices

1. **Always enable cache in production**
   - Ensure `WP_DEBUG` is `false` in production
   - The theme handles this automatically

2. **Use object cache for high-traffic sites**
   - Install Redis or Memcached
   - Install a WordPress object cache plugin
   - Theme automatically uses object cache when available

3. **Clear cache after template changes**
   ```php
   // In functions.php or a custom plugin
   if (is_admin() && isset($_GET['clear_timber_cache'])) {
       core_theme()->getTimberConfig()->clearCache();
       wp_redirect(admin_url());
       exit;
   }
   ```

4. **Monitor cache effectiveness**
   - Use Query Monitor plugin to see cache hits/misses
   - Profile with and without cache to measure improvement

### Recommended Object Cache Setup

For optimal performance, set up a persistent object cache:

#### Redis with WordPress

1. Install Redis:
```bash
# Ubuntu/Debian
sudo apt install redis-server

# macOS
brew install redis
brew services start redis
```

2. Install object cache plugin:
```bash
cd wp-content
wget https://raw.githubusercontent.com/rhubarbgroup/redis-cache/master/includes/object-cache.php
```

3. Configure in `wp-config.php`:
```php
define('WP_REDIS_HOST', '127.0.0.1');
define('WP_REDIS_PORT', 6379);
define('WP_CACHE', true);
```

The theme will automatically detect and use Redis for Timber caching.

## Performance Checklist

### ✅ Already Implemented

- [x] Defer non-critical JavaScript
- [x] Critical CSS support
- [x] Font display optimization
- [x] Font preconnect hints
- [x] Resource preloading API
- [x] Scripts in footer by default
- [x] Timber template caching (auto-configured)
- [x] Environment-aware cache settings

### 🎯 Best Practices to Follow

- [ ] Generate critical CSS for production builds
- [ ] Preload hero images and critical fonts
- [ ] Use async for analytics/tracking scripts
- [ ] Optimize and compress images
- [ ] Use WebP/AVIF image formats
- [ ] Enable HTTP/2 or HTTP/3
- [ ] Configure server-side caching
- [ ] Use a CDN for static assets
- [ ] Set up object cache (Redis/Memcached) for high-traffic sites
- [ ] Monitor Timber cache effectiveness with Query Monitor

## Measuring Performance

### Tools

1. **Lighthouse** (Chrome DevTools)
   - Run audits for Performance, Accessibility, Best Practices, SEO
   - Target scores: 90+ for all metrics

2. **WebPageTest** (https://www.webpagetest.org/)
   - Detailed waterfall charts
   - Film strip view of page loading

3. **Core Web Vitals**
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1

### Testing Commands

```bash
# Run Lighthouse from CLI
npm install -g lighthouse
lighthouse https://yoursite.com --view

# Generate critical CSS
npm install -g critical
critical https://yoursite.com --inline --base dist > dist/critical.css
```

## Advanced Optimizations

### Lazy Loading Images

WordPress 5.5+ automatically adds lazy loading to images. Ensure your `<img>` tags include width/height attributes:

```twig
{# views/components/image.twig #}
<img
    src="{{ image.src }}"
    alt="{{ image.alt }}"
    width="{{ image.width }}"
    height="{{ image.height }}"
    loading="lazy"
>
```

### Third-Party Script Management

For analytics, ads, and social media scripts, consider using:
- **Partytown** - Runs third-party scripts in a web worker
- **Google Tag Manager** - Load all scripts through one container (use async)

```php
// Example: Load GTM asynchronously
add_action('core_theme_booted', function($theme) {
    $theme->getAssets()->addAsyncScript('google-tag-manager');
});
```

### Code Splitting with Vite

Vite automatically code-splits your JavaScript. Leverage dynamic imports:

```typescript
// src/js/main.ts
async function loadHeavyModule() {
    const module = await import('./heavy-module');
    module.init();
}

// Load only when needed
document.querySelector('#button')?.addEventListener('click', loadHeavyModule);
```

## Real-World Example

Complete example with all optimizations:

```php
// functions.php (after Theme::boot())
add_action('core_theme_booted', function($theme) {
    $assets = $theme->getAssets();

    // Defer main navigation script
    $assets->addDeferredScript('navigation-menu');

    // Async analytics
    $assets->addAsyncScript('google-analytics');

    // Preload hero image
    $assets->addPreloadResource(
        get_template_directory_uri() . '/dist/images/hero-2000w.jpg',
        'image'
    );

    // Preload custom font
    $assets->addPreloadResource(
        get_template_directory_uri() . '/dist/fonts/inter-var.woff2',
        'font',
        ['as' => 'font', 'crossorigin' => true]
    );

    // Set critical CSS for homepage
    if (is_front_page()) {
        $criticalCss = file_get_contents(get_template_directory() . '/dist/critical-home.css');
        $assets->setCriticalCss($criticalCss);
    }
});
```

## Performance Goals

Target performance metrics for this theme:

| Metric | Target | Notes |
|--------|--------|-------|
| Lighthouse Performance | 90+ | With optimized images |
| First Contentful Paint (FCP) | < 1.8s | Critical CSS helps |
| Largest Contentful Paint (LCP) | < 2.5s | Preload hero images |
| Total Blocking Time (TBT) | < 300ms | Defer/async scripts |
| Cumulative Layout Shift (CLS) | < 0.1 | Include image dimensions |
| Time to Interactive (TTI) | < 3.8s | Code splitting helps |

## Resources

- [Web.dev - Web Vitals](https://web.dev/vitals/)
- [MDN - Critical Rendering Path](https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path)
- [Critical CSS Generator](https://github.com/addyosmani/critical)
- [Font Display Playground](https://font-display.glitch.me/)
