<?php
/**
 * Theme Setup Class
 *
 * Handles theme configuration, supports, and menus
 *
 * @package CoreTheme
 */

namespace CoreTheme;

class ThemeSetup
{
    /**
     * Initialize theme setup
     */
    public function init(): void
    {
        add_action('after_setup_theme', [$this, 'setup']);
    }

    /**
     * Theme setup configuration
     */
    public function setup(): void
    {
        $this->addThemeSupports();
        $this->registerMenus();
    }

    /**
     * Add theme supports
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
     */
    private function registerMenus(): void
    {
        register_nav_menus([
            'primary' => __('Primary Menu', 'core-theme'),
            'footer'  => __('Footer Menu', 'core-theme'),
        ]);
    }
}
