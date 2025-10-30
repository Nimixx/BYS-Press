<?php
/**
 * Remove jQuery Migrate Utility
 *
 * Removes jQuery Migrate script to reduce JavaScript file size
 * Only use this if your theme and plugins are compatible with modern jQuery
 *
 * NOTE: Test thoroughly after enabling this!
 * If you see JavaScript errors in console, you may need to disable this utility
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Remove jQuery Migrate from frontend
 *
 * @since 1.0.0
 * @return void
 */
add_action('wp_default_scripts', function ($scripts) {
    if (!is_admin() && isset($scripts->registered['jquery'])) {
        $jquery = $scripts->registered['jquery'];

        if ($jquery->deps) {
            // Remove jquery-migrate dependency
            $jquery->deps = array_diff($jquery->deps, ['jquery-migrate']);
        }
    }
});

/**
 * Alternative method: Dequeue jQuery Migrate
 *
 * This is a backup method in case the above doesn't work
 *
 * @since 1.0.0
 * @return void
 */
add_action('wp_enqueue_scripts', function () {
    if (!is_admin()) {
        wp_dequeue_script('jquery-migrate');
        wp_deregister_script('jquery-migrate');
    }
}, 100);
