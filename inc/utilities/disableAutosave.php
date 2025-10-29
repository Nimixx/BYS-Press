<?php
/**
 * Disable Autosave Utility
 *
 * Disables automatic post saving while editing to reduce AJAX calls and server load
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable autosave functionality
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_init', function () {
    wp_deregister_script('autosave');
});

/**
 * Increase autosave interval (alternative to complete disable)
 *
 * Uncomment the code below if you prefer to just increase the interval
 * instead of disabling autosave completely
 *
 * @since 1.0.0
 * @return int Autosave interval in seconds
 */
// add_filter('autosave_interval', function () {
//     return 300; // 5 minutes instead of default 60 seconds
// });
