<?php
/**
 * Optimize Heartbeat API Utility
 *
 * Optimizes WordPress heartbeat API to reduce server load and improve admin performance
 * The heartbeat API is used for autosave, post locking, and login expiration warnings
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Modify heartbeat settings
 *
 * @since 1.0.0
 * @param array $settings Heartbeat settings
 * @return array Modified settings
 */
add_filter('heartbeat_settings', function ($settings) {
    // Slow down the heartbeat in admin (default is 15-60 seconds)
    $settings['interval'] = 60; // Check every 60 seconds in admin

    return $settings;
});

/**
 * Disable heartbeat on frontend completely
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    if (!is_admin()) {
        wp_deregister_script('heartbeat');
    }
}, 1);

/**
 * Control where heartbeat is allowed in admin
 *
 * Disable on all admin pages except post editor
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_enqueue_scripts', function ($hook) {
    // Allow heartbeat only on post edit pages
    $allowedPages = ['post.php', 'post-new.php'];

    if (!in_array($hook, $allowedPages)) {
        wp_deregister_script('heartbeat');
    }
});
