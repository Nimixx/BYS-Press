<?php
/**
 * Timber Configuration Class
 *
 * Handles Timber initialization and configuration
 *
 * @package CoreTheme
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
     * Constructor
     *
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
     */
    public function init(): void
    {
        Timber::init();
        Timber::$dirname = $this->viewsDirs;

        add_filter('timber/context', [$this, 'addToContext']);
    }

    /**
     * Add data to Timber context
     *
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
     * @return array
     */
    public function getViewsDirs(): array
    {
        return $this->viewsDirs;
    }

    /**
     * Set views directories
     *
     * @param array $dirs
     * @return void
     */
    public function setViewsDirs(array $dirs): void
    {
        $this->viewsDirs = $dirs;
        Timber::$dirname = $dirs;
    }
}
