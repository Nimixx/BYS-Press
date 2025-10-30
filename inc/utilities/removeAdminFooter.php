<?php
/**
 * Remove Admin Footer Text Utility
 *
 * Removes and customizes admin footer text for a cleaner admin interface
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Remove default admin footer text
 *
 * @since 1.0.0
 * @return string
 */
add_filter('admin_footer_text', function () {
    return '';

    // Or customize it with your own text:
    // return 'Built with <a href="https://wordpress.org">WordPress</a>';
});

/**
 * Remove WordPress version from admin footer
 *
 * @since 1.0.0
 * @return string
 */
add_filter('update_footer', function () {
    return '';
}, 999);
