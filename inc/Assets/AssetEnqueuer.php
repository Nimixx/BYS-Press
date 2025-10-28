<?php
/**
 * Asset Enqueuer
 *
 * Handles enqueueing of theme assets using Vite
 *
 * @package CoreTheme\Assets
 * @since 1.0.0
 */

namespace CoreTheme\Assets;

use Kucrut\Vite;

class AssetEnqueuer
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
     * @since 1.0.0
     * @param string $themeDir Theme directory path
     */
    public function __construct(string $themeDir)
    {
        $this->themeDir = $themeDir;
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
    }

    /**
     * Enqueue theme assets
     *
     * @since 1.0.0
     * @return void
     */
    public function enqueueAssets(): void
    {
        Vite\enqueue_asset($this->themeDir . '/dist', 'lib/main.ts', [
            'handle' => 'core-theme-main',
            'dependencies' => [],
            'in-footer' => true,
        ]);
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
}
