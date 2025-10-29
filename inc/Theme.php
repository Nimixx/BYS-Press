<?php
/**
 * Theme Bootstrap Class
 *
 * Main class that initializes all theme components
 *
 * @package CoreTheme
 * @since 1.0.0
 */

namespace CoreTheme;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

class Theme
{
    /**
     * Theme setup instance
     *
     * @var ThemeSetup
     */
    private ThemeSetup $themeSetup;

    /**
     * Assets instance
     *
     * @var Assets
     */
    private Assets $assets;

    /**
     * Security instance
     *
     * @var Security
     */
    private Security $security;

    /**
     * Timber configuration instance
     *
     * @var TimberConfig
     */
    private TimberConfig $timberConfig;

    /**
     * Utilities manager instance
     *
     * @var UtilitiesManager
     */
    private UtilitiesManager $utilitiesManager;

    /**
     * Constructor with dependency injection
     *
     * @since 1.0.0
     * @param ThemeSetup|null $themeSetup
     * @param Assets|null $assets
     * @param Security|null $security
     * @param TimberConfig|null $timberConfig
     * @param UtilitiesManager|null $utilitiesManager
     */
    public function __construct(
        ?ThemeSetup $themeSetup = null,
        ?Assets $assets = null,
        ?Security $security = null,
        ?TimberConfig $timberConfig = null,
        ?UtilitiesManager $utilitiesManager = null,
    ) {
        $this->themeSetup = $themeSetup ?? new ThemeSetup();
        $this->assets = $assets ?? new Assets();
        $this->security = $security ?? new Security();
        $this->timberConfig =
            $timberConfig ?? new TimberConfig(['components', 'layouts', 'pages'], $this->security);
        $this->utilitiesManager = $utilitiesManager ?? new UtilitiesManager();
    }

    /**
     * Initialize the theme
     *
     * Boots up all theme components
     *
     * @since 1.0.0
     * @return void
     */
    public function boot(): void
    {
        // Load utilities first (they might be needed by other components)
        $this->utilitiesManager->init();

        // Initialize security first to generate nonce
        $this->security->init();

        // Then initialize Timber (which needs nonce in context)
        $this->timberConfig->init();

        // Finally initialize theme setup and assets
        $this->themeSetup->init();
        $this->assets->init();

        do_action('core_theme_booted', $this);
    }

    /**
     * Get theme setup instance
     *
     * @since 1.0.0
     * @return ThemeSetup
     */
    public function getThemeSetup(): ThemeSetup
    {
        return $this->themeSetup;
    }

    /**
     * Get assets instance
     *
     * @since 1.0.0
     * @return Assets
     */
    public function getAssets(): Assets
    {
        return $this->assets;
    }

    /**
     * Get security instance
     *
     * @since 1.0.0
     * @return Security
     */
    public function getSecurity(): Security
    {
        return $this->security;
    }

    /**
     * Get Timber config instance
     *
     * @since 1.0.0
     * @return TimberConfig
     */
    public function getTimberConfig(): TimberConfig
    {
        return $this->timberConfig;
    }

    /**
     * Get utilities manager instance
     *
     * @since 1.0.0
     * @return UtilitiesManager
     */
    public function getUtilitiesManager(): UtilitiesManager
    {
        return $this->utilitiesManager;
    }
}
