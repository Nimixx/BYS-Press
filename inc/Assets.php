<?php
/**
 * Assets Class
 *
 * Handles enqueueing of theme assets (scripts and styles)
 *
 * @package CoreTheme
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
     * Constructor
     *
     * @param string|null $themeDir Optional theme directory path
     */
    public function __construct(?string $themeDir = null)
    {
        $this->themeDir = $themeDir ?? get_template_directory();
    }

    /**
     * Initialize asset enqueueing
     */
    public function init(): void
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
    }

    /**
     * Enqueue theme assets
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
     * Get theme directory path
     *
     * @return string
     */
    public function getThemeDir(): string
    {
        return $this->themeDir;
    }
}
