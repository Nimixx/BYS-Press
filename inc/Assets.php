<?php
/**
 * Assets Class
 *
 * Handles enqueueing of theme assets (scripts and styles) with performance optimizations
 *
 * @package CoreTheme
 * @since 1.0.0
 */

namespace CoreTheme;

use Kucrut\Vite;

class Assets
{
    /**
     * Theme directory path
     *
     * @var string
     */
    private string $themeDir;

    /**
     * Scripts that should be deferred
     *
     * @var array
     */
    private array $deferredScripts = ['core-theme-main'];

    /**
     * Scripts that should be async
     *
     * @var array
     */
    private array $asyncScripts = [];

    /**
     * Critical CSS content
     *
     * @var string|null
     */
    private ?string $criticalCss = null;

    /**
     * Enable font optimization
     *
     * @var bool
     */
    private bool $optimizeFonts = true;

    /**
     * Resources to preload
     *
     * @var array
     */
    private array $preloadResources = [];

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param string|null $themeDir Optional theme directory path
     */
    public function __construct(?string $themeDir = null)
    {
        $this->themeDir = $themeDir ?? get_template_directory();
    }

    /**
     * Initialize asset enqueueing
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
        add_filter('script_loader_tag', [$this, 'optimizeScriptTag'], 10, 2);
        add_filter('style_loader_tag', [$this, 'optimizeStyleTag'], 10, 2);
        add_action('wp_head', [$this, 'inlineCriticalCss'], 1);
        add_action('wp_head', [$this, 'addResourceHints'], 2);

        if ($this->optimizeFonts) {
            add_filter('wp_resource_hints', [$this, 'addFontPreconnect'], 10, 2);
        }
    }

    /**
     * Enqueue theme assets
     *
     * @since 1.0.0
     * @return void
     */
    public function enqueueAssets(): void
    {
        Vite\enqueue_asset(
            $this->themeDir . '/dist',
            'src/js/main.ts',
            [
                'handle' => 'core-theme-main',
                'dependencies' => [],
                'in-footer' => true,
            ]
        );
    }

    /**
     * Optimize script tags with defer/async attributes
     *
     * @since 1.0.0
     * @param string $tag Script tag HTML
     * @param string $handle Script handle
     * @return string Modified script tag
     */
    public function optimizeScriptTag(string $tag, string $handle): string
    {
        // Add defer attribute
        if (in_array($handle, $this->deferredScripts, true)) {
            $tag = str_replace(' src', ' defer src', $tag);
        }

        // Add async attribute
        if (in_array($handle, $this->asyncScripts, true)) {
            $tag = str_replace(' src', ' async src', $tag);
        }

        return $tag;
    }

    /**
     * Optimize style tags
     *
     * @since 1.0.0
     * @param string $tag Style tag HTML
     * @param string $handle Style handle
     * @return string Modified style tag
     */
    public function optimizeStyleTag(string $tag, string $handle): string
    {
        // Add font-display: swap to font stylesheets
        if ($this->optimizeFonts && (strpos($handle, 'font') !== false || strpos($tag, 'fonts.googleapis.com') !== false)) {
            // For Google Fonts, add display=swap parameter
            if (strpos($tag, 'fonts.googleapis.com') !== false && strpos($tag, 'display=swap') === false) {
                $tag = str_replace('css?family=', 'css?display=swap&family=', $tag);
            }
        }

        return $tag;
    }

    /**
     * Inline critical CSS
     *
     * @since 1.0.0
     * @return void
     */
    public function inlineCriticalCss(): void
    {
        if ($this->criticalCss !== null) {
            echo '<style id="critical-css">' . $this->criticalCss . '</style>' . "\n";
            return;
        }

        // Check if critical CSS file exists
        $criticalCssPath = $this->themeDir . '/dist/critical.css';
        if (file_exists($criticalCssPath)) {
            $css = file_get_contents($criticalCssPath);
            echo '<style id="critical-css">' . $css . '</style>' . "\n";
        }
    }

    /**
     * Add resource hints (preload, prefetch, preconnect)
     *
     * @since 1.0.0
     * @return void
     */
    public function addResourceHints(): void
    {
        foreach ($this->preloadResources as $resource) {
            $type = $resource['type'] ?? 'script';
            $as = $resource['as'] ?? $type;
            $crossorigin = isset($resource['crossorigin']) ? ' crossorigin' : '';

            echo sprintf(
                '<link rel="preload" href="%s" as="%s"%s>' . "\n",
                esc_url($resource['url']),
                esc_attr($as),
                $crossorigin
            );
        }
    }

    /**
     * Add font preconnect hints
     *
     * @since 1.0.0
     * @param array $urls Resource hint URLs
     * @param string $relation_type Type of resource hint
     * @return array Modified URLs
     */
    public function addFontPreconnect(array $urls, string $relation_type): array
    {
        if ($relation_type === 'preconnect') {
            $urls[] = [
                'href' => 'https://fonts.googleapis.com',
                'crossorigin' => 'anonymous',
            ];
            $urls[] = [
                'href' => 'https://fonts.gstatic.com',
                'crossorigin' => 'anonymous',
            ];
        }

        return $urls;
    }

    /**
     * Set critical CSS content
     *
     * @since 1.0.0
     * @param string $css Critical CSS content
     * @return self
     */
    public function setCriticalCss(string $css): self
    {
        $this->criticalCss = $css;
        return $this;
    }

    /**
     * Add script to be deferred
     *
     * @since 1.0.0
     * @param string $handle Script handle
     * @return self
     */
    public function addDeferredScript(string $handle): self
    {
        $this->deferredScripts[] = $handle;
        return $this;
    }

    /**
     * Add script to be loaded async
     *
     * @since 1.0.0
     * @param string $handle Script handle
     * @return self
     */
    public function addAsyncScript(string $handle): self
    {
        $this->asyncScripts[] = $handle;
        return $this;
    }

    /**
     * Add resource to preload
     *
     * @since 1.0.0
     * @param string $url Resource URL
     * @param string $type Resource type (script, style, font, image)
     * @param array $options Additional options (as, crossorigin)
     * @return self
     */
    public function addPreloadResource(string $url, string $type = 'script', array $options = []): self
    {
        $this->preloadResources[] = array_merge([
            'url' => $url,
            'type' => $type,
        ], $options);
        return $this;
    }

    /**
     * Enable or disable font optimization
     *
     * @since 1.0.0
     * @param bool $enable
     * @return self
     */
    public function setFontOptimization(bool $enable): self
    {
        $this->optimizeFonts = $enable;
        return $this;
    }

    /**
     * Get theme directory path
     *
     * @since 1.0.0
     * @return string
     */
    public function getThemeDir(): string
    {
        return $this->themeDir;
    }

    /**
     * Get deferred scripts
     *
     * @since 1.0.0
     * @return array
     */
    public function getDeferredScripts(): array
    {
        return $this->deferredScripts;
    }

    /**
     * Get async scripts
     *
     * @since 1.0.0
     * @return array
     */
    public function getAsyncScripts(): array
    {
        return $this->asyncScripts;
    }
}
