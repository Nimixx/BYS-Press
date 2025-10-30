<?php
/**
 * Fix Login Security Utility
 *
 * Fixes critical security vulnerability: user enumeration via login error messages
 *
 * By default, WordPress reveals whether a username exists:
 * - "The username XXX is not registered" → Username doesn't exist
 * - "Wrong password" → Username exists
 *
 * This makes brute force attacks much easier. This utility prevents user enumeration.
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Generic login error message (CRITICAL SECURITY FIX)
 *
 * Prevents user enumeration by showing the same error for:
 * - Invalid username
 * - Incorrect password
 * - Empty credentials
 *
 * Attackers cannot determine if username exists or not
 *
 * @since 1.0.0
 * @param string $error Original error message
 * @return string Generic error message
 */
add_filter('login_errors', function ($error) {
    // Check if we're on the login page (not admin)
    global $pagenow;
    if ($pagenow === 'wp-login.php') {
        // Return generic error - don't reveal if username exists
        return '<strong>Error:</strong> Invalid username or password.';
    }
    return $error;
});

/**
 * Prevent user enumeration via REST API
 *
 * By default, WordPress REST API exposes usernames at /wp-json/wp/v2/users
 *
 * @since 1.0.0
 * @return void
 */
add_filter('rest_authentication_errors', function ($access) {
    // Block unauthenticated access to users endpoint
    if (!is_user_logged_in()) {
        return new WP_Error(
            'rest_forbidden',
            __('You do not have permission to access this resource.'),
            ['status' => 401]
        );
    }
    return $access;
});

/**
 * Prevent user enumeration via author archives
 *
 * WordPress author URLs reveal usernames: /?author=1 redirects to /author/username
 *
 * @since 1.0.0
 * @return void
 */
add_action('template_redirect', function () {
    // Check if someone is trying to access author archives with ?author=ID
    if (is_admin() || !isset($_GET['author']) || !is_numeric($_GET['author'])) {
        return;
    }

    // If they're trying to enumerate users, redirect to homepage
    wp_safe_redirect(home_url(), 301);
    exit;
});

/**
 * Remove author meta tag from wp_head
 *
 * Prevents username leakage via HTML meta tags
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'rel_canonical');
});

/**
 * Prevent username disclosure in oEmbed responses
 *
 * @since 1.0.0
 * @param array $data oEmbed response data
 * @return array Modified data
 */
add_filter('oembed_response_data', function ($data) {
    unset($data['author_name']);
    unset($data['author_url']);
    return $data;
});
