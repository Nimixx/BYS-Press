<?php
/**
 * Clean wp_head Utility
 *
 * Removes unnecessary meta tags and links from wp_head
 * Improves security and reduces HTML bloat
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Remove unnecessary wp_head items
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    // Remove WordPress version from head
    remove_action('wp_head', 'wp_generator');

    // Remove Windows Live Writer manifest link
    remove_action('wp_head', 'wlwmanifest_link');

    // Remove shortlink
    remove_action('wp_head', 'wp_shortlink_wp_head');

    // Remove REST API link from head
    remove_action('wp_head', 'rest_output_link_wp_head');

    // Remove REST API link from HTTP headers
    remove_action('template_redirect', 'rest_output_link_header', 11);

    // Remove adjacent posts links
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head');

    // Remove WordPress version from RSS feeds
    add_filter('the_generator', '__return_empty_string');
});

/**
 * Remove WordPress version from scripts and styles
 *
 * @since 1.0.0
 * @param string $src Source URL
 * @return string Modified source URL
 */
add_filter('style_loader_src', function ($src) {
    if (strpos($src, 'ver=' . get_bloginfo('version'))) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}, 9999);

add_filter('script_loader_src', function ($src) {
    if (strpos($src, 'ver=' . get_bloginfo('version'))) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}, 9999);
