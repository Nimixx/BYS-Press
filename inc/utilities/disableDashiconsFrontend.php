<?php
/**
 * Disable Dashicons on Frontend Utility
 *
 * Removes Dashicons CSS from frontend for non-logged-in users
 *
 * Dashicons is WordPress admin icon font (~50KB) that loads on every page
 * even on frontend where it's rarely needed. This creates unnecessary HTTP
 * requests and slows down page load for visitors.
 *
 * PERFORMANCE BENEFIT:
 * - Saves ~50KB per page load
 * - Reduces HTTP requests by 1
 * - Faster page load for visitors
 * - Lower bandwidth usage
 *
 * NOTE: Dashicons will still load for logged-in users (for admin bar)
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Remove Dashicons for non-logged-in users
 *
 * Keeps Dashicons for logged-in users who see admin bar
 *
 * @since 1.0.0
 * @return void
 */
add_action('wp_enqueue_scripts', function () {
    // Only remove if user is not logged in
    if (!is_user_logged_in()) {
        wp_dequeue_style('dashicons');
        wp_deregister_style('dashicons');
    }
});

/**
 * Remove Dashicons from login page
 *
 * Login page doesn't need Dashicons unless specifically used in custom login
 *
 * @since 1.0.0
 * @return void
 */
add_action('login_enqueue_scripts', function () {
    wp_dequeue_style('dashicons');
    wp_deregister_style('dashicons');
}, 20);

/**
 * Prevent Dashicons from loading via other methods
 *
 * Some plugins might try to load Dashicons on frontend
 *
 * @since 1.0.0
 * @return void
 */
add_action('wp_print_styles', function () {
    if (!is_user_logged_in() && !is_admin()) {
        wp_dequeue_style('dashicons');
    }
}, 100);

/**
 * Alternative: Conditionally load Dashicons only where needed
 *
 * If you need Dashicons on specific pages, use this instead
 * Uncomment and customize the conditions
 *
 * @since 1.0.0
 * @return void
 */
/*
add_action('wp_enqueue_scripts', function () {
    // Don't remove for logged-in users
    if (is_user_logged_in()) {
        return;
    }

    // Load only on specific pages where you use Dashicons
    if (is_page(['contact', 'about'])) {
        return; // Keep Dashicons on these pages
    }

    // Remove everywhere else
    wp_dequeue_style('dashicons');
    wp_deregister_style('dashicons');
});
*/
