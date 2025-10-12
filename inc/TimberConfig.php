<?php
/**
 * Timber Configuration Class
 *
 * Handles Timber initialization and configuration
 *
 * @package CoreTheme
 * @since 1.0.0
 */

namespace CoreTheme;

use Timber\Timber;
use Timber\Site;

class TimberConfig
{
    /**
     * Views directory names
     *
     * @var array
     */
    private array $viewsDirs;

    /**
     * Security instance
     *
     * @var Security|null
     */
    private ?Security $security = null;

    /**
     * Enable Timber cache
     *
     * @var bool
     */
    private bool $enableCache = true;

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param array $viewsDirs Optional views directories
     * @param Security|null $security Optional security instance
     */
    public function __construct(array $viewsDirs = ['views'], ?Security $security = null)
    {
        $this->viewsDirs = $viewsDirs;
        $this->security = $security;
    }

    /**
     * Initialize Timber
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        Timber::init();
        Timber::$dirname = $this->viewsDirs;

        // Configure caching
        $this->configureCaching();

        add_filter('timber/context', [$this, 'addToContext']);
    }

    /**
     * Configure Timber caching
     *
     * Timber caching improves performance by caching compiled Twig templates.
     * Cache is disabled in development mode (WP_DEBUG) and enabled in production.
     *
     * Timber 2.x uses a simple boolean cache setting. When enabled, Timber will
     * cache compiled templates using WordPress transients/object cache if available.
     *
     * @since 1.0.0
     * @return void
     */
    private function configureCaching(): void
    {
        // Disable cache in development/debug mode
        if (defined('WP_DEBUG') && WP_DEBUG) {
            Timber::$cache = false;
            return;
        }

        // Enable or disable cache based on configuration
        // When true, Timber automatically uses WordPress object cache if available,
        // otherwise falls back to transients
        Timber::$cache = $this->enableCache;
    }

    /**
     * Add data to Timber context
     *
     * @since 1.0.0
     * @param array $context
     * @return array
     */
    public function addToContext(array $context): array
    {
        $context['site'] = new Site();

        // Add CSP nonce to context for inline scripts/styles in templates
        if ($this->security !== null) {
            $context['csp_nonce'] = $this->security->getNonce();
        }

        return apply_filters('core_theme_timber_context', $context);
    }

    /**
     * Get views directories
     *
     * @since 1.0.0
     * @return array
     */
    public function getViewsDirs(): array
    {
        return $this->viewsDirs;
    }

    /**
     * Set views directories
     *
     * @since 1.0.0
     * @param array $dirs
     * @return void
     */
    public function setViewsDirs(array $dirs): void
    {
        $this->viewsDirs = $dirs;
        Timber::$dirname = $dirs;
    }

    /**
     * Enable or disable Timber cache
     *
     * @since 1.0.0
     * @param bool $enable
     * @return self
     */
    public function setCacheEnabled(bool $enable): self
    {
        $this->enableCache = $enable;
        return $this;
    }

    /**
     * Clear Timber cache
     *
     * Clears all cached Twig templates
     *
     * @since 1.0.0
     * @return bool True on success, false on failure
     */
    public function clearCache(): bool
    {
        return Timber::clear_cache_timber();
    }

    /**
     * Clear Twig cache
     *
     * Clears compiled Twig templates from cache directory
     *
     * @since 1.0.0
     * @return bool True on success, false on failure
     */
    public function clearTwigCache(): bool
    {
        return Timber::clear_cache_twig();
    }
}
