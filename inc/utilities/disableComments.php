<?php
/**
 * Disable Comments Utility
 *
 * Completely disables WordPress comments system
 * Good for business/portfolio sites that don't need comments
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable comments support for all post types
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_init', function () {
    // Redirect any user trying to access comments page
    global $pagenow;

    if ($pagenow === 'edit-comments.php') {
        wp_safe_redirect(admin_url());
        exit;
    }

    // Remove comments metabox from dashboard
    remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');

    // Disable support for comments and trackbacks in post types
    foreach (get_post_types() as $postType) {
        if (post_type_supports($postType, 'comments')) {
            remove_post_type_support($postType, 'comments');
            remove_post_type_support($postType, 'trackbacks');
        }
    }
});

/**
 * Close comments on the frontend
 *
 * @since 1.0.0
 * @return bool
 */
add_filter('comments_open', '__return_false', 20, 2);
add_filter('pings_open', '__return_false', 20, 2);

/**
 * Hide existing comments
 *
 * @since 1.0.0
 * @param array $comments Existing comments
 * @return array Empty array
 */
add_filter('comments_array', '__return_empty_array', 10, 2);

/**
 * Remove comments page from admin menu
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_menu', function () {
    remove_menu_page('edit-comments.php');
});

/**
 * Remove comments links from admin bar
 *
 * @since 1.0.0
 * @param WP_Admin_Bar $wpAdminBar Admin bar instance
 * @return void
 */
add_action('admin_bar_menu', function ($wpAdminBar) {
    $wpAdminBar->remove_menu('comments');
}, 999);

/**
 * Remove comment support from admin
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    if (is_admin()) {
        // Remove comments column from posts list
        add_filter('manage_posts_columns', function ($columns) {
            unset($columns['comments']);
            return $columns;
        });

        add_filter('manage_pages_columns', function ($columns) {
            unset($columns['comments']);
            return $columns;
        });
    }
});

/**
 * Remove comments feed
 *
 * @since 1.0.0
 * @return void
 */
add_action('template_redirect', function () {
    if (is_comment_feed()) {
        wp_die(__('Comments are disabled.'), '', ['response' => 403]);
    }
}, 9);
