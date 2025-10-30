<?php
/**
 * Remove Dashboard Widgets Utility
 *
 * Removes unnecessary default WordPress dashboard widgets to clean up the admin
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Remove default dashboard widgets
 *
 * @since 1.0.0
 * @return void
 */
add_action('wp_dashboard_setup', function () {
    // Remove Welcome panel
    remove_action('welcome_panel', 'wp_welcome_panel');

    // Remove default widgets
    remove_meta_box('dashboard_primary', 'dashboard', 'side'); // WordPress Events and News
    remove_meta_box('dashboard_quick_press', 'dashboard', 'side'); // Quick Draft
    remove_meta_box('dashboard_recent_drafts', 'dashboard', 'side'); // Recent Drafts
    remove_meta_box('dashboard_activity', 'dashboard', 'normal'); // Activity
    remove_meta_box('dashboard_right_now', 'dashboard', 'normal'); // At a Glance
    remove_meta_box('dashboard_site_health', 'dashboard', 'normal'); // Site Health

    // Remove plugin widgets (if you use these plugins)
    remove_meta_box('wpe_dify_news_feed', 'dashboard', 'normal'); // WP Engine
    remove_meta_box('dashboard_secondary', 'dashboard', 'side'); // Other WordPress News
});
