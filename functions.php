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
