# Configuration

Learn how to configure BYS Press theme for your environment and requirements.

## Environment Configuration

### wp-config.php Settings

**Development Mode**:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);
define('WP_ENVIRONMENT_TYPE', 'local');
```

**Staging Mode**:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('WP_ENVIRONMENT_TYPE', 'staging');
```

**Production Mode**:
```php
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_ENVIRONMENT_TYPE', 'production');

// Security
define('DISALLOW_FILE_EDIT', true);
define('FORCE_SSL_ADMIN', true);
define('DISABLE_WP_CRON', true);
```

## Theme Configuration

### Timber Directories

**Default**:
```php
// inc/TimberConfig.php
private array $viewsDirs = ['components', 'layouts', 'pages'];
```

**Customize**:
```php
add_action('bys_press_booted', function($theme) {
    $timberConfig = $theme->getTimberConfig();
    $timberConfig->setViewsDirs([
        'components',
        'layouts',
        'pages',
        'partials', // Add custom directory
    ]);
});
```

### Timber Caching

**Enable/Disable**:
```php
add_action('bys_press_booted', function($theme) {
    $timberConfig = $theme->getTimberConfig();
    $timberConfig->setCacheEnabled(false); // Disable cache
});
```

**Clear Cache**:
```php
bys_press()->getTimberConfig()->clearCache();
bys_press()->getTimberConfig()->clearTwigCache();
```

## Security Configuration

### Content Security Policy

**Add Allowed Domains**:
```php
add_action('bys_press_booted', function($theme) {
    $security = $theme->getSecurity();

    // Allow Google Fonts
    $security->addAllowedStyleDomain('https://fonts.googleapis.com');
    $security->addAllowedStyleDomain('https://fonts.gstatic.com');

    // Allow Google Analytics
    $security->addAllowedScriptDomain('https://www.google-analytics.com');
});
```

**Custom CSP Directives**:
```php
add_filter('bys_press_csp_directives', function($directives, $nonce) {
    // Allow YouTube embeds
    $directives['frame-src'] = ['https://www.youtube.com'];

    // Allow images from any HTTPS source
    $directives['img-src'][] = 'https:';

    // Allow form submissions to external API
    $directives['form-action'][] = 'https://api.example.com';

    return $directives;
}, 10, 2);
```

**Disable CSP** (not recommended):
```php
add_action('bys_press_booted', function($theme) {
    remove_action('send_headers', [
        $theme->getSecurity()->getContentSecurityPolicy(),
        'sendCspHeader'
    ]);
});
```

### Permissions Policy

```php
add_filter('bys_press_permissions_policy', function($permissions) {
    // Allow geolocation
    $permissions['geolocation'] = 'self';

    // Allow camera for specific domain
    $permissions['camera'] = 'self https://meet.example.com';

    return $permissions;
});
```

## Asset Configuration

### Vite Settings

**File**: `vite.config.ts`

```typescript
export default defineConfig({
  server: {
    port: 5173,
    host: 'localhost',
    cors: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
        },
      },
    },
  },
});
```

### Script/Style Optimization

**Defer Scripts**:
```php
add_action('bys_press_booted', function($theme) {
    $assets = $theme->getAssets();
    $assets->addDeferredScript('my-script');
});
```

**Async Scripts**:
```php
add_action('bys_press_booted', function($theme) {
    $assets = $theme->getAssets();
    $assets->addAsyncScript('analytics');
});
```

**Critical CSS**:
```php
add_action('bys_press_booted', function($theme) {
    $criticalCss = file_get_contents(__DIR__ . '/critical.css');
    $theme->getAssets()->setCriticalCss($criticalCss);
});
```

### Resource Hints

**Preload Assets**:
```php
add_action('bys_press_booted', function($theme) {
    $assets = $theme->getAssets();

    // Preload font
    $assets->addPreloadResource(
        get_theme_file_uri('fonts/font.woff2'),
        'font',
        ['as' => 'font', 'type' => 'font/woff2', 'crossorigin' => true]
    );
});
```

## WordPress Configuration

### Theme Supports

**Add More Supports**:
```php
add_action('after_setup_theme', function() {
    // Wide alignment
    add_theme_support('align-wide');

    // Responsive embeds
    add_theme_support('responsive-embeds');

    // Custom line height
    add_theme_support('custom-line-height');

    // Custom spacing
    add_theme_support('custom-spacing');
});
```

### Menu Locations

**Add Menu Location**:
```php
add_action('after_setup_theme', function() {
    register_nav_menus([
        'header-cta' => __('Header CTA', 'bys-press'),
        'mobile' => __('Mobile Menu', 'bys-press'),
    ]);
});
```

### Image Sizes

**Add Custom Sizes**:
```php
add_action('after_setup_theme', function() {
    add_image_size('hero', 1920, 1080, true);
    add_image_size('card', 600, 400, true);
    add_image_size('thumbnail-large', 400, 400, true);
});
```

## Utilities Configuration

### Disable Specific Utility

Delete file or conditionally load:

```php
// inc/UtilitiesManager.php - modify loadUtility()
private function loadUtility(string $file): void
{
    $basename = basename($file, '.php');

    // Skip utilities
    $disabled = ['disableEmojis', 'disableComments'];
    if (in_array($basename, $disabled)) {
        return;
    }

    require_once $file;
    $this->loadedUtilities[] = $basename;
}
```

### Customize Utility Behavior

```php
// Override defaults in functions.php
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 120; // Change from 60 to 120 seconds
    return $settings;
});
```

## Context Providers

### Add Custom Context

**Create Provider**:
```php
// inc/Context/Providers/CustomContextProvider.php
namespace BYSPress\Context\Providers;

use BYSPress\Context\ContextProviderInterface;

class CustomContextProvider implements ContextProviderInterface
{
    public function addToContext(array $context): array
    {
        $context['custom_data'] = $this->getCustomData();
        return $context;
    }

    private function getCustomData(): array
    {
        return [
            'site_settings' => get_option('my_settings'),
            'user_count' => count_users(),
        ];
    }
}
```

**Register Provider**:
```php
// inc/TimberConfig.php - in registerContextProviders()
$this->contextProviders[] = new CustomContextProvider();
```

## Performance Configuration

### Disable Features

```php
// Disable features you don't use
remove_theme_support('custom-header');
remove_theme_support('custom-background');

// Disable REST API routes
add_filter('rest_endpoints', function($endpoints) {
    unset($endpoints['/wp/v2/users']);
    return $endpoints;
});
```

### Optimize Database

```sql
-- Clean up revisions
DELETE FROM wp_posts WHERE post_type = 'revision';

-- Optimize tables
OPTIMIZE TABLE wp_posts, wp_postmeta, wp_options;
```

## Multisite Configuration

```php
// wp-config.php
define('WP_ALLOW_MULTISITE', true);
define('MULTISITE', true);
define('SUBDOMAIN_INSTALL', false); // or true
define('DOMAIN_CURRENT_SITE', 'example.com');
define('PATH_CURRENT_SITE', '/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);
```

## Localization

### Translation Files

**Location**: `languages/`

**Generate POT file**:
```bash
wp i18n make-pot . languages/bys-press.pot
```

**Add Translation**:
```php
// In template
__('Text to translate', 'bys-press');
_e('Echo this text', 'bys-press');
```

## Debugging Configuration

### Enable Query Monitor

```php
// wp-config.php
define('QM_ENABLE_CAPS_PANEL', true);
```

Install [Query Monitor](https://wordpress.org/plugins/query-monitor/) plugin.

### Log Custom Events

```php
if (WP_DEBUG_LOG) {
    error_log('Custom event: ' . print_r($data, true));
}
```

### Timber Debug

```twig
{# In any Twig template #}
{{ dump(post) }}
{{ dump() }}  {# All context #}
```

## Production Checklist

Before going live:

- [ ] Set `WP_ENVIRONMENT_TYPE` to 'production'
- [ ] Disable `WP_DEBUG`
- [ ] Run `npm run build`
- [ ] Enable object caching
- [ ] Set up regular backups
- [ ] Configure CDN (if using)
- [ ] Test security headers
- [ ] Update PHP version (8.1+)
- [ ] Enable HTTPS
- [ ] Set strong passwords
- [ ] Limit login attempts
- [ ] Configure CSP correctly
- [ ] Test on multiple browsers
- [ ] Check mobile responsiveness
- [ ] Verify analytics tracking
- [ ] Test contact forms
- [ ] Check 404 pages
- [ ] Set up monitoring

## Resources

- [WordPress Configuration](https://wordpress.org/documentation/article/editing-wp-config-php/)
- [Timber Documentation](https://timber.github.io/docs/)
- [Vite Configuration](https://vitejs.dev/config/)

---

**Documentation Complete!** You now have all the information needed to work with BYS Press theme effectively.
