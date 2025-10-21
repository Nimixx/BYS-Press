# Core Theme - Improvement Plan

**Based on Comprehensive Audit - October 20, 2025**

This document outlines prioritized improvements to transform Core Theme into a rock-solid, production-ready WordPress theme foundation. Tasks are organized by priority and include specific implementation steps, effort estimates, and success criteria.

---

## 📊 Overview

| Priority | Tasks | Estimated Time | Impact |
|----------|-------|----------------|--------|
| 🔴 Critical | 8 | 8-12 hours | High |
| 🟠 High | 12 | 16-24 hours | High |
| 🟡 Medium | 10 | 12-16 hours | Medium |
| 🟢 Low | 8 | 8-12 hours | Low-Medium |
| **TOTAL** | **38 tasks** | **44-64 hours** | - |

**Total Estimated Effort:** 1-2 weeks of focused development

---

## 🔴 Critical Priority (Must Fix Before Production)

These issues must be resolved before using the theme in production environments.

### CRIT-01: Fix Documentation Inconsistency (Svelte → Vue)

**Issue:** Documentation extensively references Svelte 5, but theme uses Vue 3
**Impact:** Developer confusion, wasted time, poor onboarding experience
**Effort:** 1 hour

**Files to Update:**
- `CLAUDE.md` - Complete rewrite
- `src/js/config/vueComponents.ts` - Update comments and examples
- `README.md` - Verify all references
- `package.json` - Check description
- Any other markdown files in `md-docs/`

**Implementation Steps:**
```bash
# 1. Search for all Svelte references
grep -r "Svelte" --include="*.md" --include="*.ts" --include="*.js" .

# 2. Update each file
# Find/Replace:
# - "Svelte" → "Vue"
# - "svelte" → "vue"
# - ".svelte" → ".vue"
# - "Svelte 5" → "Vue 3"
# - Svelte-specific API references → Vue 3 equivalents

# 3. Update code examples in documentation
# Replace Svelte component examples with Vue SFC examples

# 4. Update component registry examples
# Use Vue composition API / Options API examples
```

**Success Criteria:**
- [ ] No references to Svelte in documentation
- [ ] All code examples use Vue 3 syntax
- [ ] Component examples match actual implementation
- [ ] CLAUDE.md accurately describes Vue 3 architecture

---

### CRIT-02: Generate Translation (i18n) Files

**Issue:** Text domain declared but no .pot file exists
**Impact:** Theme cannot be translated into other languages
**Effort:** 30 minutes

**Implementation Steps:**
```bash
# 1. Install WP-CLI i18n command (if not installed)
wp package install wp-cli/i18n-command

# 2. Generate POT file
wp i18n make-pot . languages/core-theme.pot

# 3. Verify POT file
# Check that all translatable strings are included
cat languages/core-theme.pot | grep msgid

# 4. Add to version control
git add languages/core-theme.pot

# 5. Update .gitignore to track .pot but ignore .mo files
echo "*.mo" >> .gitignore
```

**Additional i18n Tasks:**
```php
// 6. Add load_theme_textdomain to ThemeSetup.php
private function loadTextDomain(): void
{
    load_theme_textdomain('core-theme', get_template_directory() . '/languages');
}

// Call in setup() method
public function setup(): void
{
    $this->addThemeSupports();
    $this->registerMenus();
    $this->loadTextDomain(); // Add this
}
```

**Success Criteria:**
- [ ] `languages/core-theme.pot` file exists
- [ ] POT file contains all translatable strings
- [ ] Text domain loaded in theme
- [ ] Translation functions work with Poedit/Loco Translate

---

### CRIT-03: Complete PHP Test Coverage

**Issue:** Assets.php and TimberConfig.php have 0% test coverage
**Impact:** Bugs may go undetected, refactoring is risky
**Effort:** 4 hours

**Create AssetsTest.php:**
```php
<?php
// tests/AssetsTest.php

namespace CoreTheme\Tests;

use CoreTheme\Assets;
use Brain\Monkey\Functions;
use PHPUnit\Framework\TestCase;
use Brain\Monkey;

class AssetsTest extends TestCase
{
    private Assets $assets;

    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();
        $this->assets = new Assets('/test/theme/path');
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    /** @test */
    public function it_initializes_hooks(): void
    {
        Functions\expect('add_action')
            ->with('wp_enqueue_scripts', [$this->assets, 'enqueueAssets'])
            ->once();

        Functions\expect('add_filter')
            ->with('script_loader_tag', [$this->assets, 'optimizeScriptTag'], 10, 2)
            ->once();

        // ... more hook expectations

        $this->assets->init();
    }

    /** @test */
    public function it_adds_defer_to_deferred_scripts(): void
    {
        $tag = '<script src="test.js"></script>';
        $this->assets->addDeferredScript('test-handle');

        $result = $this->assets->optimizeScriptTag($tag, 'test-handle');

        $this->assertStringContainsString('defer', $result);
    }

    /** @test */
    public function it_adds_async_to_async_scripts(): void
    {
        $tag = '<script src="test.js"></script>';
        $this->assets->addAsyncScript('test-handle');

        $result = $this->assets->optimizeScriptTag($tag, 'test-handle');

        $this->assertStringContainsString('async', $result);
    }

    /** @test */
    public function it_optimizes_google_fonts_with_display_swap(): void
    {
        $tag = '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">';

        $result = $this->assets->optimizeStyleTag($tag, 'google-fonts');

        $this->assertStringContainsString('display=swap', $result);
    }

    /** @test */
    public function it_can_set_critical_css(): void
    {
        $css = '.critical { color: red; }';

        $this->assets->setCriticalCss($css);

        $this->expectOutputString('<style id="critical-css">.critical { color: red; }</style>' . "\n");
        $this->assets->inlineCriticalCss();
    }

    /** @test */
    public function it_adds_preload_resources(): void
    {
        Functions\expect('esc_url')->andReturnFirstArg();
        Functions\expect('esc_attr')->andReturnFirstArg();

        $this->assets->addPreloadResource('/test.js', 'script');

        $this->expectOutputRegex('/<link rel="preload" href="\/test\.js" as="script">/');
        $this->assets->addResourceHints();
    }

    /** @test */
    public function it_gets_deferred_scripts(): void
    {
        $this->assets->addDeferredScript('test-1');
        $this->assets->addDeferredScript('test-2');

        $deferred = $this->assets->getDeferredScripts();

        $this->assertContains('test-1', $deferred);
        $this->assertContains('test-2', $deferred);
    }
}
```

**Create TimberConfigTest.php:**
```php
<?php
// tests/TimberConfigTest.php

namespace CoreTheme\Tests;

use CoreTheme\TimberConfig;
use CoreTheme\Security;
use Brain\Monkey\Functions;
use PHPUnit\Framework\TestCase;
use Brain\Monkey;

class TimberConfigTest extends TestCase
{
    private TimberConfig $timberConfig;
    private Security $security;

    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();
        $this->security = $this->createMock(Security::class);
        $this->timberConfig = new TimberConfig(['views'], $this->security);
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    /** @test */
    public function it_adds_nonce_to_timber_context(): void
    {
        $this->security->method('getNonce')->willReturn('test-nonce-123');

        Functions\expect('apply_filters')
            ->with('core_theme_timber_context', \Mockery::type('array'))
            ->andReturnFirstArg();

        $context = $this->timberConfig->addToContext([]);

        $this->assertEquals('test-nonce-123', $context['csp_nonce']);
    }

    /** @test */
    public function it_gets_views_directories(): void
    {
        $dirs = $this->timberConfig->getViewsDirs();

        $this->assertEquals(['views'], $dirs);
    }

    /** @test */
    public function it_sets_views_directories(): void
    {
        $this->timberConfig->setViewsDirs(['custom', 'views']);

        $dirs = $this->timberConfig->getViewsDirs();

        $this->assertEquals(['custom', 'views'], $dirs);
    }

    /** @test */
    public function it_can_enable_cache(): void
    {
        $result = $this->timberConfig->setCacheEnabled(true);

        $this->assertInstanceOf(TimberConfig::class, $result);
    }

    /** @test */
    public function it_can_disable_cache(): void
    {
        $result = $this->timberConfig->setCacheEnabled(false);

        $this->assertInstanceOf(TimberConfig::class, $result);
    }
}
```

**Create ThemeTest.php (Integration Test):**
```php
<?php
// tests/ThemeTest.php

namespace CoreTheme\Tests;

use CoreTheme\Theme;
use CoreTheme\ThemeSetup;
use CoreTheme\Assets;
use CoreTheme\Security;
use CoreTheme\TimberConfig;
use Brain\Monkey\Functions;
use PHPUnit\Framework\TestCase;
use Brain\Monkey;

class ThemeTest extends TestCase
{
    private Theme $theme;

    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    /** @test */
    public function it_boots_all_components_in_correct_order(): void
    {
        Functions\expect('do_action')
            ->with('core_theme_booted', \Mockery::type(Theme::class))
            ->once();

        $security = $this->createMock(Security::class);
        $security->expects($this->once())->method('init');

        $timberConfig = $this->createMock(TimberConfig::class);
        $timberConfig->expects($this->once())->method('init');

        $themeSetup = $this->createMock(ThemeSetup::class);
        $themeSetup->expects($this->once())->method('init');

        $assets = $this->createMock(Assets::class);
        $assets->expects($this->once())->method('init');

        $theme = new Theme($themeSetup, $assets, $security, $timberConfig);
        $theme->boot();
    }

    /** @test */
    public function it_provides_access_to_components(): void
    {
        $this->theme = new Theme();

        $this->assertInstanceOf(ThemeSetup::class, $this->theme->getThemeSetup());
        $this->assertInstanceOf(Assets::class, $this->theme->getAssets());
        $this->assertInstanceOf(Security::class, $this->theme->getSecurity());
        $this->assertInstanceOf(TimberConfig::class, $this->theme->getTimberConfig());
    }
}
```

**Run Tests:**
```bash
# Run PHP tests
composer test

# Generate coverage report
composer test:coverage
# Open coverage/index.html in browser

# Target: 80%+ coverage
```

**Success Criteria:**
- [ ] AssetsTest.php created with 10+ tests
- [ ] TimberConfigTest.php created with 6+ tests
- [ ] ThemeTest.php created with integration tests
- [ ] All tests pass
- [ ] Code coverage > 80% for tested classes

---

### CRIT-04: Add JavaScript/Vue Component Tests

**Issue:** No Vue component tests exist
**Impact:** Component bugs undetected, refactoring risky
**Effort:** 2 hours

**Create Counter.test.ts:**
```typescript
// src/components/Counter.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Counter from './Counter.vue';

describe('Counter Component', () => {
  it('renders with initial count of 0', () => {
    const wrapper = mount(Counter);
    expect(wrapper.text()).toContain('0');
  });

  it('increments count when button clicked', async () => {
    const wrapper = mount(Counter);
    const button = wrapper.find('button');

    await button.trigger('click');

    expect(wrapper.text()).toContain('1');
  });

  it('accepts initial count as prop', () => {
    const wrapper = mount(Counter, {
      props: {
        initialCount: 5
      }
    });

    expect(wrapper.text()).toContain('5');
  });

  it('applies custom class when provided', () => {
    const wrapper = mount(Counter, {
      props: {
        class: 'custom-counter'
      }
    });

    expect(wrapper.classes()).toContain('custom-counter');
  });
});
```

**Create vueComponentMount.test.ts:**
```typescript
// src/js/utils/vueComponentMount.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mountVueComponent, mountVueComponents } from './vueComponentMount';
import type { VueComponentConfig } from './vueComponentMount';

describe('vueComponentMount', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts component when element exists', () => {
    document.body.innerHTML = '<div id="test-component"></div>';

    const mockComponent = { name: 'TestComponent' };
    const config: VueComponentConfig = {
      component: mockComponent as any,
      elementId: 'test-component',
      name: 'TestComponent',
    };

    const result = mountVueComponent(config);

    expect(result).toBeDefined();
    expect(result?.component).toBe(mockComponent);
  });

  it('does not mount when element missing and not required', () => {
    const config: VueComponentConfig = {
      component: {} as any,
      elementId: 'missing-element',
      name: 'MissingComponent',
      required: false,
    };

    const result = mountVueComponent(config);

    expect(result).toBeNull();
  });

  it('warns when required component element is missing', () => {
    const consoleSpy = vi.spyOn(console, 'warn');

    const config: VueComponentConfig = {
      component: {} as any,
      elementId: 'missing-required',
      name: 'RequiredComponent',
      required: true,
    };

    mountVueComponent(config);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Required component')
    );
  });

  it('respects condition function', () => {
    document.body.innerHTML = '<div id="conditional-component"></div>';

    const config: VueComponentConfig = {
      component: {} as any,
      elementId: 'conditional-component',
      name: 'ConditionalComponent',
      condition: () => false, // Condition fails
    };

    const result = mountVueComponent(config);

    expect(result).toBeNull();
  });

  it('passes props to component', () => {
    document.body.innerHTML = '<div id="props-component"></div>';

    const props = { message: 'Hello', count: 42 };
    const config: VueComponentConfig = {
      component: {} as any,
      elementId: 'props-component',
      name: 'PropsComponent',
      props,
    };

    const result = mountVueComponent(config);

    expect(result?.props).toEqual(props);
  });

  it('mounts multiple components', () => {
    document.body.innerHTML = `
      <div id="component-1"></div>
      <div id="component-2"></div>
    `;

    const configs: VueComponentConfig[] = [
      {
        component: { name: 'Component1' } as any,
        elementId: 'component-1',
        name: 'Component1',
      },
      {
        component: { name: 'Component2' } as any,
        elementId: 'component-2',
        name: 'Component2',
      },
    ];

    const results = mountVueComponents(configs);

    expect(results).toHaveLength(2);
    expect(results[0]).toBeDefined();
    expect(results[1]).toBeDefined();
  });
});
```

**Add @vue/test-utils:**
```bash
npm install --save-dev @vue/test-utils
```

**Update package.json:**
```json
{
  "scripts": {
    "test:components": "vitest run src/components",
    "test:utils": "vitest run src/js/utils"
  }
}
```

**Success Criteria:**
- [ ] Counter.test.ts created and passing
- [ ] vueComponentMount.test.ts created and passing
- [ ] Test coverage > 80% for utils
- [ ] All component tests pass

---

### CRIT-05: Enable XML-RPC Blocking by Default

**Issue:** XML-RPC blocking method exists but not called
**Impact:** Potential attack vector remains open
**Effort:** 5 minutes

**Implementation:**
```php
// inc/Security.php

public function init(): void
{
    // Generate nonce early
    add_action('init', [$this, 'generateNonce'], 1);

    add_action('send_headers', [$this, 'sendSecurityHeaders']);
    add_filter('the_generator', '__return_empty_string');
    remove_action('wp_head', 'wp_generator');

    // Add nonce to inline scripts and styles
    add_filter('script_loader_tag', [$this, 'addNonceToScript'], 10, 2);
    add_filter('style_loader_tag', [$this, 'addNonceToStyle'], 10, 2);

    $this->configureRestApiSecurity();
    $this->disableFileEditing();
    $this->disableXmlRpc(); // ADD THIS LINE
}
```

**Document in SECURITY.md:**
```markdown
### XML-RPC Protection

XML-RPC is disabled by default to prevent:
- Brute force attacks via xmlrpc.php
- DDoS amplification attacks
- Pingback spam

If you need XML-RPC (e.g., for Jetpack), you can re-enable it:

```php
// In functions.php or custom plugin
remove_filter('xmlrpc_enabled', '__return_false');
```
```

**Success Criteria:**
- [x] XML-RPC disabled by default
- [x] Security.md updated with documentation
- [x] Test added for XML-RPC blocking

---

### CRIT-06: Fix style.css in Git Status

**Issue:** style.css appears as modified in git status
**Impact:** Unclear if this is source or build output
**Effort:** 15 minutes

**Investigation & Fix:**
```bash
# 1. Check what changed
git diff style.css

# 2. Determine if this is build output or source
# - If source: Commit the changes
# - If build output: Should be in dist/

# 3. If it's build output that shouldn't be in root:
# Move to dist/ and update build process

# 4. If it's legitimate source changes:
git add style.css
git commit -m "Update theme header information"

# 5. Update .gitignore if needed
# Add build artifacts that shouldn't be tracked
```

**Verify Build Process:**
```bash
# Check if Vite generates style.css in root
npm run build
git status

# If style.css is generated, add to .gitignore
echo "/style.css" >> .gitignore  # Only if it's build output
```

**Success Criteria:**
- [ ] Clarified whether style.css is source or build output
- [ ] Appropriate action taken (commit or ignore)
- [ ] Clean git status
- [ ] Documented in README if special handling needed

---

### CRIT-07: Add Bundle Size Analysis

**Issue:** No visibility into JavaScript bundle size
**Impact:** Bundle size regression may go unnoticed
**Effort:** 30 minutes

**Implementation:**
```bash
# 1. Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer
```

**Update vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import { v4wp } from '@kucrut/vite-for-wp';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    vue(),
    v4wp({
      input: 'src/js/main.ts',
      outDir: 'dist',
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
        // Add manual chunks for better splitting
        manualChunks: {
          'vue-vendor': ['vue'],
        },
      },
    },
    // Set size warnings
    chunkSizeWarningLimit: 500, // KB
  },
});
```

**Add npm script:**
```json
// package.json
{
  "scripts": {
    "build:analyze": "npm run build && open dist/stats.html"
  }
}
```

**Set Performance Budget:**
```javascript
// Create .budgetrc.json
{
  "budgets": [
    {
      "path": "dist/js/*.js",
      "limit": "200kb",
      "gzip": true
    },
    {
      "path": "dist/css/*.css",
      "limit": "50kb",
      "gzip": true
    }
  ]
}
```

**Success Criteria:**
- [ ] Visualizer installed and configured
- [ ] `npm run build:analyze` opens bundle analysis
- [ ] Bundle size within reasonable limits (<200KB gzipped for JS)
- [ ] Documented in README

---

### CRIT-08: Add Pre-commit Hooks (Code Quality)

**Issue:** No automated checks before commits
**Impact:** Code quality inconsistencies, broken commits
**Effort:** 30 minutes

**Implementation:**
```bash
# 1. Install Husky and lint-staged
npm install --save-dev husky lint-staged

# 2. Initialize Husky
npx husky init

# 3. Create pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

**Create lint-staged config:**
```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ],
    "*.php": [
      "composer run-script test"
    ],
    "*.md": [
      "prettier --write"
    ]
  }
}
```

**Add commit message linting (optional):**
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Create commitlint config
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# Add commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

**Success Criteria:**
- [ ] Husky installed and initialized
- [ ] Pre-commit hook runs linting and formatting
- [ ] Commit fails if linting fails
- [ ] Documented in README

---

## 🟠 High Priority (Significant Improvements)

### HIGH-01: Implement Image Lazy Loading

**Issue:** No lazy loading for images
**Impact:** Poor performance on image-heavy pages
**Effort:** 1 hour

**Implementation:**
```php
// inc/ThemeSetup.php

/**
 * Configure image lazy loading
 *
 * @since 1.0.0
 * @return void
 */
private function configureLazyLoading(): void
{
    // Add loading="lazy" to all images
    add_filter('wp_get_attachment_image_attributes', function ($attr, $attachment) {
        // Don't lazy load if it's above the fold (first image in content)
        if (!isset($attr['loading'])) {
            $attr['loading'] = 'lazy';
        }
        return $attr;
    }, 10, 2);

    // Add lazy loading to post thumbnails
    add_filter('post_thumbnail_html', function ($html) {
        if (strpos($html, 'loading=') === false) {
            $html = str_replace('<img', '<img loading="lazy"', $html);
        }
        return $html;
    });

    // Add lazy loading to content images
    add_filter('the_content', function ($content) {
        if (is_feed()) {
            return $content;
        }

        $content = preg_replace_callback(
            '/<img([^>]+)>/i',
            function ($matches) {
                if (strpos($matches[1], 'loading=') !== false) {
                    return $matches[0];
                }
                return '<img loading="lazy"' . $matches[1] . '>';
            },
            $content
        );

        return $content;
    });
}

// Update setup() method
public function setup(): void
{
    $this->addThemeSupports();
    $this->registerMenus();
    $this->loadTextDomain();
    $this->configureLazyLoading(); // Add this
}
```

**Test:**
```bash
# Build and check HTML output
npm run build
# Inspect page source and verify loading="lazy" on images
```

**Success Criteria:**
- [ ] All images have loading="lazy" attribute
- [ ] First/hero image excluded from lazy loading (optional)
- [ ] PageSpeed score improves
- [ ] Tested on real content

---

### HIGH-02: Add Responsive Image Sizes

**Issue:** No custom image sizes defined
**Impact:** Large images served to mobile devices
**Effort:** 1 hour

**Implementation:**
```php
// inc/ThemeSetup.php

/**
 * Register custom image sizes
 *
 * @since 1.0.0
 * @return void
 */
private function registerImageSizes(): void
{
    // Hero/Banner images
    add_image_size('hero-desktop', 1920, 1080, true);
    add_image_size('hero-tablet', 1280, 720, true);
    add_image_size('hero-mobile', 768, 432, true);

    // Card/Thumbnail images
    add_image_size('card-large', 800, 600, true);
    add_image_size('card-medium', 600, 450, true);
    add_image_size('card-small', 400, 300, true);

    // Blog post featured images
    add_image_size('post-featured', 1200, 675, true);
    add_image_size('post-thumbnail', 600, 400, true);

    // Square thumbnails for galleries
    add_image_size('square-large', 800, 800, true);
    add_image_size('square-medium', 400, 400, true);
    add_image_size('square-small', 200, 200, true);
}

// Update setup()
public function setup(): void
{
    $this->addThemeSupports();
    $this->registerMenus();
    $this->loadTextDomain();
    $this->configureLazyLoading();
    $this->registerImageSizes(); // Add this
}
```

**Create Twig Macro for Responsive Images:**
```twig
{# views/macros/image.twig #}

{% macro responsive(image, sizes, alt, class) %}
  {% if image %}
    <picture class="{{ class }}">
      {# WebP sources #}
      {% if image.src('hero-mobile')|webp %}
        <source
          type="image/webp"
          media="(max-width: 767px)"
          srcset="{{ image.src('hero-mobile')|webp }}">
      {% endif %}

      {% if image.src('hero-tablet')|webp %}
        <source
          type="image/webp"
          media="(max-width: 1279px)"
          srcset="{{ image.src('hero-tablet')|webp }}">
      {% endif %}

      {% if image.src('hero-desktop')|webp %}
        <source
          type="image/webp"
          srcset="{{ image.src('hero-desktop')|webp }}">
      {% endif %}

      {# Fallback JPG/PNG sources #}
      <source
        media="(max-width: 767px)"
        srcset="{{ image.src('hero-mobile') }}">

      <source
        media="(max-width: 1279px)"
        srcset="{{ image.src('hero-tablet') }}">

      <img
        src="{{ image.src('hero-desktop') }}"
        alt="{{ alt|e('html_attr') }}"
        loading="lazy"
        width="{{ image.width }}"
        height="{{ image.height }}">
    </picture>
  {% endif %}
{% endmacro %}
```

**Document in README:**
```markdown
## Image Sizes

The theme registers the following image sizes:

| Size | Dimensions | Crop | Usage |
|------|------------|------|-------|
| `hero-desktop` | 1920x1080 | Hard | Hero banners (desktop) |
| `hero-tablet` | 1280x720 | Hard | Hero banners (tablet) |
| `hero-mobile` | 768x432 | Hard | Hero banners (mobile) |
| `card-large` | 800x600 | Hard | Large cards |
| `card-medium` | 600x450 | Hard | Medium cards |
| `card-small` | 400x300 | Hard | Small cards |
| `post-featured` | 1200x675 | Hard | Blog featured images |

### Using Responsive Images in Twig

```twig
{% import 'macros/image.twig' as img %}

{{ img.responsive(post.thumbnail, 'hero', post.title, 'hero-image') }}
```
```

**Success Criteria:**
- [ ] Custom image sizes registered
- [ ] Responsive image macro created
- [ ] Documentation added
- [ ] Tested with uploaded images
- [ ] Smaller images served to mobile

---

### HIGH-03: Generate and Implement Critical CSS

**Issue:** Critical CSS infrastructure exists but not used
**Impact:** Above-the-fold content renders slower
**Effort:** 2 hours

**Installation:**
```bash
npm install --save-dev critical
```

**Create Critical CSS Script:**
```javascript
// scripts/generate-critical-css.js

import { generate } from 'critical';
import fs from 'fs';
import path from 'path';

const urls = [
  {
    url: 'http://localhost:8888/', // Your local URL
    output: 'dist/critical-home.css',
  },
  {
    url: 'http://localhost:8888/sample-page/',
    output: 'dist/critical-page.css',
  },
  {
    url: 'http://localhost:8888/blog/',
    output: 'dist/critical-blog.css',
  },
];

async function generateCriticalCSS() {
  for (const config of urls) {
    try {
      const { css } = await generate({
        base: 'dist/',
        src: config.url,
        width: 1920,
        height: 1080,
        inline: false,
      });

      fs.writeFileSync(config.output, css);
      console.log(`✓ Generated: ${config.output}`);
    } catch (error) {
      console.error(`✗ Failed: ${config.url}`, error.message);
    }
  }
}

generateCriticalCSS().catch(console.error);
```

**Update package.json:**
```json
{
  "scripts": {
    "critical": "node scripts/generate-critical-css.js",
    "build:critical": "npm run build && npm run critical"
  }
}
```

**Update Assets.php to use page-specific critical CSS:**
```php
// inc/Assets.php

public function inlineCriticalCss(): void
{
    // Determine which critical CSS to use
    $criticalFile = 'critical-home.css';

    if (is_page()) {
        $criticalFile = 'critical-page.css';
    } elseif (is_singular('post') || is_home() || is_archive()) {
        $criticalFile = 'critical-blog.css';
    }

    $criticalCssPath = $this->themeDir . '/dist/' . $criticalFile;

    if (file_exists($criticalCssPath)) {
        $css = file_get_contents($criticalCssPath);

        // Minify CSS if not already minified
        $css = preg_replace('/\s+/', ' ', $css);
        $css = preg_replace('/\/\*.*?\*\//', '', $css);

        echo '<style id="critical-css">' . $css . '</style>' . "\n";
    }
}
```

**Add to Build Process:**
```bash
# Update your deployment script
npm run build
npm run critical
```

**Success Criteria:**
- [ ] Critical CSS generated for main page types
- [ ] Page-specific critical CSS loaded
- [ ] First Contentful Paint improves by >200ms
- [ ] Documented in PERFORMANCE.md

---

### HIGH-04: Add Web Vitals Tracking

**Issue:** No performance monitoring
**Impact:** Can't track performance regression
**Effort:** 1 hour

**Installation:**
```bash
npm install web-vitals
```

**Create Web Vitals Tracker:**
```typescript
// src/js/utils/webVitals.ts

import { getCLS, getFID, getFCP, getLCP, getTTFB, type Metric } from 'web-vitals';
import { isDevelopment } from '../config';

/**
 * Send metric to analytics
 */
function sendToAnalytics(metric: Metric): void {
  // Send to Google Analytics (if available)
  if (typeof window.gtag === 'function') {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Log in development
  if (isDevelopment) {
    console.log('📊 Web Vital:', metric.name, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Send to custom analytics endpoint (optional)
  if (!isDevelopment) {
    navigator.sendBeacon?.(
      '/wp-json/core-theme/v1/analytics',
      JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        path: window.location.pathname,
      })
    );
  }
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals(): void {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

/**
 * Log all metrics to console (development only)
 */
export function logWebVitals(): void {
  if (!isDevelopment) return;

  console.group('🎯 Web Vitals Report');

  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);

  console.groupEnd();
}
```

**Add type definitions:**
```typescript
// src/vite-env.d.ts

interface Window {
  gtag?: (...args: any[]) => void;
}
```

**Update main.ts:**
```typescript
// src/js/main.ts

import { initWebVitals } from './utils/webVitals';

function initTheme(): void {
  // ... existing code ...

  // Initialize Web Vitals tracking
  initWebVitals();
}
```

**Success Criteria:**
- [ ] Web Vitals tracked and logged
- [ ] Metrics sent to Google Analytics (if configured)
- [ ] Development logging works
- [ ] Baseline metrics documented

---

### HIGH-05: Set Up CI/CD Pipeline (GitHub Actions)

**Issue:** No automated testing on commits
**Impact:** Manual testing burden, potential broken builds
**Effort:** 2 hours

**Create GitHub Actions Workflow:**
```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  php-tests:
    name: PHP Tests
    runs-on: ubuntu-latest

    strategy:
      matrix:
        php-version: ['8.1', '8.2', '8.3']

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php-version }}
          extensions: mbstring, xml
          coverage: xdebug

      - name: Install Composer dependencies
        run: composer install --prefer-dist --no-progress

      - name: Run tests
        run: composer test

      - name: Generate coverage
        if: matrix.php-version == '8.2'
        run: composer test:coverage

      - name: Upload coverage to Codecov
        if: matrix.php-version == '8.2'
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/clover.xml

  javascript-tests:
    name: JavaScript Tests
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: ['18', '20', '22']

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:run

      - name: Generate coverage
        if: matrix.node-version == '20'
        run: npm run test:coverage

      - name: Upload coverage
        if: matrix.node-version == '20'
        uses: codecov/codecov-action@v3

  code-quality:
    name: Code Quality
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

  build:
    name: Build
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build production
        run: npm run build

      - name: Check bundle size
        run: |
          SIZE=$(du -sk dist/js/*.js | awk '{sum+=$1} END {print sum}')
          echo "Bundle size: ${SIZE}KB"
          if [ $SIZE -gt 500 ]; then
            echo "❌ Bundle size exceeds 500KB!"
            exit 1
          fi

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

**Add Status Badge to README:**
```markdown
# Core Theme

![CI Status](https://github.com/yourusername/core-theme/workflows/CI/badge.svg)
![PHP Version](https://img.shields.io/badge/php-%3E%3D8.1-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18-green)

...
```

**Success Criteria:**
- [ ] CI workflow created
- [ ] Tests run on push/PR
- [ ] Multiple PHP versions tested
- [ ] Multiple Node versions tested
- [ ] Build verification works
- [ ] Bundle size checked
- [ ] Status badge in README

---

### HIGH-06: Add Accessibility Testing

**Issue:** No automated accessibility testing
**Impact:** May miss a11y issues
**Effort:** 2 hours

**Install Axe Core:**
```bash
npm install --save-dev axe-core @axe-core/playwright
```

**Create Accessibility Test:**
```typescript
// tests/accessibility.spec.ts

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:8888');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('blog page should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:8888/blog');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('single post should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:8888/sample-post');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('skip link should be functional', async ({ page }) => {
    await page.goto('http://localhost:8888');

    // Press Tab to focus skip link
    await page.keyboard.press('Tab');

    // Check if skip link is focused
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeFocused();

    // Press Enter to activate
    await page.keyboard.press('Enter');

    // Main content should be focused
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('keyboard navigation should work', async ({ page }) => {
    await page.goto('http://localhost:8888');

    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First nav link

    // Check that focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBe('A');
  });
});
```

**Install Playwright:**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Create Playwright Config:**
```typescript
// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:8888',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

**Add npm scripts:**
```json
{
  "scripts": {
    "test:a11y": "playwright test",
    "test:a11y:ui": "playwright test --ui"
  }
}
```

**Success Criteria:**
- [ ] Automated a11y tests run
- [ ] No critical violations
- [ ] Keyboard navigation tested
- [ ] Skip links functional
- [ ] Documentation created

---

### HIGH-07: Add Login Security & Brute Force Protection

**Issue:** No login attempt limiting
**Impact:** Vulnerable to brute force attacks
**Effort:** 2 hours

**Create LoginSecurity.php** - See IMPROVEMENT_PLAN.md for full implementation

**Success Criteria:**
- [ ] LoginSecurity class created
- [ ] Login attempts limited
- [ ] Lockout works after max attempts
- [ ] Admin email sent on lockout
- [ ] Tests created
- [ ] Documented in SECURITY.md

---

### HIGH-08: Document Browser Support Policy

**Issue:** No documented browser support
**Impact:** Unclear what browsers to test
**Effort:** 30 minutes

**Create .browserslistrc:**
```
# Browsers that we support

last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
last 2 Edge versions
not IE 11
not dead
> 0.5%
```

**Update package.json:**
```json
{
  "browserslist": [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Safari versions",
    "last 2 Edge versions",
    "not IE 11",
    "not dead",
    "> 0.5%"
  ]
}
```

**Success Criteria:**
- [ ] .browserslistrc created
- [ ] Documented in README
- [ ] Vite uses correct targets
- [ ] CSS autoprefixer configured

---

## 🟡 Medium Priority (Enhancements)

### MED-01: Add More Vue Component Examples
**Effort:** 3 hours
- [ ] Navigation.vue (mobile menu)
- [ ] SearchForm.vue
- [ ] Modal.vue
- [ ] Tabs.vue
- [ ] Accordion.vue

### MED-02: Add Object Caching Guide
**Effort:** 2 hours
- [ ] Document Redis setup
- [ ] Document Memcached setup
- [ ] Provide usage examples

### MED-03: Create Storybook for Components
**Effort:** 4 hours
- [ ] Install and configure Storybook
- [ ] Create stories for all components
- [ ] Document in README

### MED-04: Add CSS Custom Property Documentation
**Effort:** 1 hour
- [ ] Document all CSS variables
- [ ] Create design tokens guide

### MED-05: Add More Custom Post Type Examples
**Effort:** 2 hours
- [ ] Portfolio CPT
- [ ] Testimonials CPT
- [ ] Include templates

### MED-06: Add Form Validation Utilities
**Effort:** 2 hours
- [ ] Create reusable validation functions
- [ ] Add error handling utilities

### MED-07: Add Error Logging to Server
**Effort:** 1 hour
- [ ] Log JS errors to WordPress
- [ ] Optional external service integration

### MED-08: Create Theme Options Panel
**Effort:** 3 hours
- [ ] WordPress Customizer sections
- [ ] OR ACF Options Page

### MED-09: Add Social Sharing Component
**Effort:** 2 hours
- [ ] Create Vue component
- [ ] Support major platforms

### MED-10: Performance Budget Configuration
**Effort:** 1 hour
- [ ] Set up automated checks
- [ ] Add to CI pipeline

---

## 🟢 Low Priority (Nice to Have)

### LOW-01: PWA Support
**Effort:** 3 hours
- [ ] Add service worker
- [ ] Create app manifest
- [ ] Configure caching strategies

### LOW-02: Dark Mode Implementation
**Effort:** 3 hours
- [ ] CSS custom properties for themes
- [ ] Toggle component
- [ ] User preference storage

### LOW-03: Add Animation Library
**Effort:** 2 hours
- [ ] Integrate GSAP or Vue transitions
- [ ] Create animation utilities

### LOW-04: Add SVG Sprite System
**Effort:** 2 hours
- [ ] Create SVG sprite generator
- [ ] Icon component

### LOW-05: Add Schema.org Structured Data
**Effort:** 2 hours
- [ ] JSON-LD implementation
- [ ] SEO enhancement

### LOW-06: Add Lazy Load for Vue Components
**Effort:** 1 hour
- [ ] Intersection observer
- [ ] Lazy component mounting

### LOW-07: Create Development Docker Environment
**Effort:** 3 hours
- [ ] Docker Compose setup
- [ ] WordPress + MySQL + phpMyAdmin

### LOW-08: Add Component Generator Script
**Effort:** 2 hours
- [ ] CLI tool for scaffolding
- [ ] Template generation

---

## 📅 Implementation Roadmap

### Week 1: Critical Fixes (8-12 hours)
**Days 1-2:**
- [x] CRIT-01: Fix documentation (Svelte → Vue)
- [x] CRIT-02: Generate translation files
- [x] CRIT-05: Enable XML-RPC blocking (✅ Implemented & Documented)
- [x] CRIT-06: Fix style.css git status
- [x] CRIT-08: Add pre-commit hooks

**Days 3-5:**
- [x] CRIT-03: Complete PHP test coverage
- [x] CRIT-04: Add JavaScript/Vue tests
- [x] CRIT-07: Add bundle size analysis

### Week 2: High Priority (16-24 hours)
**Days 1-2:**
- [ ] HIGH-01: Image lazy loading
- [ ] HIGH-02: Responsive image sizes
- [ ] HIGH-03: Critical CSS generation

**Days 3-4:**
- [ ] HIGH-04: Web Vitals tracking
- [ ] HIGH-05: CI/CD pipeline setup

**Day 5:**
- [ ] HIGH-06: Accessibility testing
- [ ] HIGH-07: Login security
- [ ] HIGH-08: Browser support documentation

### Week 3: Medium Priority (Select based on needs)
- [ ] MED-01: More component examples
- [ ] MED-02: Object caching guide
- [ ] MED-03: Storybook setup

### Week 4: Testing & Documentation
- [ ] Run full test suite
- [ ] Update all documentation
- [ ] Create release notes
- [ ] Tag v2.0.0

---

## 🎯 Success Metrics

After completing all critical and high priority tasks:

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Test Coverage (PHP) | ~40% | >80% | `composer test:coverage` |
| Test Coverage (JS) | ~30% | >80% | `npm run test:coverage` |
| Bundle Size (JS) | Unknown | <200KB gzipped | Bundle analyzer |
| PageSpeed Score | ~85 | >90 | PageSpeed Insights |
| Accessibility Score | ~80 | >95 | Lighthouse/axe |
| Security Headers Grade | A | A+ | SecurityHeaders.com |
| Code Quality (ESLint) | 0 warnings | 0 warnings | `npm run lint` |
| Documentation Coverage | 60% | 90% | Manual review |

---

## 🔄 Continuous Improvement

### Monthly Tasks
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Check performance metrics
- [ ] Review analytics for errors

### Quarterly Tasks
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Accessibility audit
- [ ] Update documentation

### Yearly Tasks
- [ ] Major version updates
- [ ] Architecture review
- [ ] Technology stack evaluation
- [ ] Comprehensive testing

---

**Last Updated:** October 20, 2025
**Version:** 1.0.0

**Priority Key:**
- 🔴 Critical: Must fix before production
- 🟠 High: Significant improvements
- 🟡 Medium: Enhancements
- 🟢 Low: Nice to have
