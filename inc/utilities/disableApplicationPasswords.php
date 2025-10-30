<?php
/**
 * Disable Application Passwords Utility
 *
 * Disables WordPress Application Passwords feature (introduced in WP 5.6)
 *
 * Application passwords allow users to authenticate external applications
 * without using their actual password. While useful for some use cases,
 * they increase attack surface and should be disabled if not needed.
 *
 * SECURITY BENEFIT:
 * - Reduces attack vectors
 * - Prevents password bypass mechanisms
 * - Simplifies authentication flow
 * - Removes REST API authentication method
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable application passwords feature completely
 *
 * @since 1.0.0
 * @return bool Always false
 */
add_filter('wp_is_application_passwords_available', '__return_false');

/**
 * Remove application passwords from user profile
 *
 * Hides the application passwords section in user edit screen
 *
 * @since 1.0.0
 * @return void
 */
add_filter('wp_is_application_passwords_available_for_user', '__return_false', 10, 2);

/**
 * Disable application passwords REST API endpoints
 *
 * Removes the REST API endpoints for managing application passwords
 *
 * @since 1.0.0
 * @param array $endpoints REST API endpoints
 * @return array Modified endpoints
 */
add_filter('rest_endpoints', function ($endpoints) {
    // Remove application passwords endpoints
    if (isset($endpoints['/wp/v2/users/(?P<user_id>(?:[\d]+|me))/application-passwords'])) {
        unset($endpoints['/wp/v2/users/(?P<user_id>(?:[\d]+|me))/application-passwords']);
    }

    if (isset($endpoints['/wp/v2/users/(?P<user_id>(?:[\d]+|me))/application-passwords/(?P<uuid>[\w\-]+)'])) {
        unset($endpoints['/wp/v2/users/(?P<user_id>(?:[\d]+|me))/application-passwords/(?P<uuid>[\w\-]+)']);
    }

    if (isset($endpoints['/wp/v2/users/(?P<user_id>(?:[\d]+|me))/application-passwords/introspect'])) {
        unset($endpoints['/wp/v2/users/(?P<user_id>(?:[\d]+|me))/application-passwords/introspect']);
    }

    return $endpoints;
});

/**
 * Remove application passwords from authentication methods
 *
 * Prevents authentication via application passwords
 *
 * @since 1.0.0
 * @param WP_User|WP_Error|null $user User object or error
 * @param string $password Password provided
 * @return WP_User|WP_Error User object or error
 */
add_filter('application_password_is_api_request', '__return_false');

/**
 * Clean up database on activation (optional)
 *
 * Removes any existing application passwords from database
 * Uncomment if you want to remove existing app passwords
 *
 * @since 1.0.0
 * @return void
 */
/*
add_action('admin_init', function () {
    global $wpdb;

    // Only run once
    if (get_option('core_theme_app_passwords_cleaned')) {
        return;
    }

    // Delete all application passwords
    $wpdb->delete(
        $wpdb->prefix . 'usermeta',
        ['meta_key' => '_application_passwords']
    );

    // Mark as cleaned
    update_option('core_theme_app_passwords_cleaned', true);
}, 1);
*/
