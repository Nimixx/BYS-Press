<?php
/**
 * Theme Bootstrap Class
 *
 * Main class that initializes all theme components
 *
 * @package CoreTheme
 */

namespace CoreTheme;

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
     * Constructor with dependency injection
     *
     * @param ThemeSetup|null $themeSetup
     * @param Assets|null $assets
     * @param Security|null $security
     * @param TimberConfig|null $timberConfig
     */
    public function __construct(
        ?ThemeSetup $themeSetup = null,
        ?Assets $assets = null,
        ?Security $security = null,
        ?TimberConfig $timberConfig = null
    ) {
        $this->themeSetup = $themeSetup ?? new ThemeSetup();
        $this->assets = $assets ?? new Assets();
        $this->security = $security ?? new Security();
        $this->timberConfig = $timberConfig ?? new TimberConfig(['views'], $this->security);
    }

    /**
     * Initialize the theme
     *
     * Boots up all theme components
     */
    public function boot(): void
    {
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
     * @return ThemeSetup
     */
    public function getThemeSetup(): ThemeSetup
    {
        return $this->themeSetup;
    }

    /**
     * Get assets instance
     *
     * @return Assets
     */
    public function getAssets(): Assets
    {
        return $this->assets;
    }

    /**
     * Get security instance
     *
     * @return Security
     */
    public function getSecurity(): Security
    {
        return $this->security;
    }

    /**
     * Get Timber config instance
     *
     * @return TimberConfig
     */
    public function getTimberConfig(): TimberConfig
    {
        return $this->timberConfig;
    }
}
