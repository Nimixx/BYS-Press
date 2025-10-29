<?php
/**
 * Hide Admin Notices Utility
 *
 * Hides plugin/theme update notices for non-administrator users
 * Provides a cleaner admin experience for clients
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Hide update notices for non-admins
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_head', function () {
    if (!current_user_can('update_core')) {
        remove_action('admin_notices', 'update_nag', 3);
    }
}, 1);

/**
 * Hide WordPress core update notices
 *
 * Only shows to administrators
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_menu', function () {
    if (!current_user_can('update_core')) {
        remove_action('admin_notices', 'update_nag', 3);
        remove_action('network_admin_notices', 'update_nag', 3);
    }
});

/**
 * Remove update notifications for non-admins
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_init', function () {
    if (!current_user_can('update_core')) {
        // Hide plugin updates
        remove_action('load-update-core.php', 'wp_update_plugins');
        add_filter('pre_site_transient_update_plugins', '__return_null');

        // Hide theme updates
        remove_action('load-update-core.php', 'wp_update_themes');
        add_filter('pre_site_transient_update_themes', '__return_null');

        // Hide WordPress core updates
        add_filter('pre_site_transient_update_core', '__return_null');
    }
});

/**
 * Hide all admin notices for non-admins (optional - more aggressive)
 *
 * Uncomment this section if you want to hide ALL admin notices for non-admins
 * This provides the cleanest experience but may hide important plugin messages
 *
 * @since 1.0.0
 * @return void
 */
/*
add_action('admin_print_styles', function () {
    if (!current_user_can('update_core')) {
        echo '<style>.notice, .update-nag { display: none !important; }</style>';
    }
});
*/
