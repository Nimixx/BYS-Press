<?php
/**
 * Theme Setup Class
 *
 * Handles theme configuration, supports, and menus
 *
 * @package CoreTheme
 * @since 1.0.0
 */

namespace CoreTheme;

class ThemeSetup
{
    /**
     * Initialize theme setup
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        add_action('after_setup_theme', [$this, 'setup']);
    }

    /**
     * Theme setup configuration
     *
     * @since 1.0.0
     * @return void
     */
    public function setup(): void
    {
        $this->loadTextDomain();
        $this->addThemeSupports();
        $this->registerMenus();
    }

    /**
     * Load theme text domain for translations
     *
     * @since 1.0.0
     * @return void
     */
    private function loadTextDomain(): void
    {
        load_theme_textdomain('core-theme', get_template_directory() . '/languages');
    }

    /**
     * Add theme supports
     *
     * @since 1.0.0
     * @return void
     */
    private function addThemeSupports(): void
    {
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
        add_theme_support('html5', [
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ]);
        add_theme_support('automatic-feed-links');
        add_theme_support('custom-logo');
    }

    /**
     * Register navigation menus
     *
     * @since 1.0.0
     * @return void
     */
    private function registerMenus(): void
    {
        register_nav_menus([
            'primary' => __('Primary Menu', 'core-theme'),
            'footer'  => __('Footer Menu', 'core-theme'),
        ]);
    }
}
