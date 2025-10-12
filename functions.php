<?php
/**
 * Core Theme Functions
 */

// Load Composer dependencies
require_once __DIR__ . '/vendor/autoload.php';

// Initialize Timber
Timber\Timber::init();

// Set Timber views directory
Timber::$dirname = ['views'];

/**
 * Theme Setup
 */
function core_theme_setup() {
    // Add theme support
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

    // Register navigation menus
    register_nav_menus([
        'primary' => __('Primary Menu', 'core-theme'),
        'footer'  => __('Footer Menu', 'core-theme'),
    ]);
}
add_action('after_setup_theme', 'core_theme_setup');

/**
 * Timber Context
 *
 * Adds global variables to the Timber context
 */
add_filter('timber/context', function ($context) {
    $context['site'] = new Timber\Site();
    return $context;
});

/**
 * Enqueue theme assets
 */
function core_theme_enqueue_assets() {
    Kucrut\Vite\enqueue_asset(
        get_template_directory() . '/dist',
        'src/js/main.ts',
        [
            'handle' => 'core-theme-main',
            'dependencies' => [],
            'in-footer' => true,
        ]
    );
}
add_action('wp_enqueue_scripts', 'core_theme_enqueue_assets');
