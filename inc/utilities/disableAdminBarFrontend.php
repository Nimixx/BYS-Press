<?php
/**
 * Disable Admin Bar on Frontend Utility
 *
 * Removes the admin bar from the frontend for all users to improve performance
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable admin bar on frontend for all users
 *
 * @since 1.0.0
 * @return void
 */
add_filter('show_admin_bar', '__return_false');

/**
 * Remove admin bar related scripts and styles from frontend
 *
 * @since 1.0.0
 * @return void
 */
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_style('admin-bar');
    wp_dequeue_script('admin-bar');
}, 999);

/**
 * Remove admin bar inline styles
 *
 * @since 1.0.0
 * @return void
 */
add_action('get_header', function () {
    remove_action('wp_head', '_admin_bar_bump_cb');
});
