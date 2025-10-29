<?php
/**
 * Disable Embeds Utility
 *
 * Removes WordPress oEmbed functionality and related scripts
 * Improves performance by reducing HTTP requests and script loading
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable embeds functionality
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    // Remove oEmbed discovery links
    remove_action('wp_head', 'wp_oembed_add_discovery_links');

    // Remove oEmbed-specific JavaScript from the front-end and back-end
    remove_action('wp_head', 'wp_oembed_add_host_js');

    // Remove all embeds rewrite rules
    add_filter('rewrite_rules_array', function ($rules) {
        foreach ($rules as $rule => $rewrite) {
            if (strpos($rewrite, 'embed=true') !== false) {
                unset($rules[$rule]);
            }
        }
        return $rules;
    });

    // Remove embed query var
    add_filter('query_vars', function ($vars) {
        $vars = array_diff($vars, ['embed']);
        return $vars;
    });

    // Disable oEmbed auto discovery
    remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);

    // Turn off oEmbed auto discovery
    add_filter('embed_oembed_discover', '__return_false');

    // Remove filter of the oEmbed result before any HTTP requests are made
    remove_filter('pre_oembed_result', 'wp_filter_pre_oembed_result', 10);
}, 9999);

/**
 * Dequeue embed script
 *
 * @since 1.0.0
 * @return void
 */
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_script('wp-embed');
}, 100);

/**
 * Remove embed script from TinyMCE
 *
 * @since 1.0.0
 * @param array $plugins TinyMCE plugins
 * @return array Modified plugins
 */
add_filter('tiny_mce_plugins', function ($plugins) {
    return array_diff($plugins, ['wpembed']);
});

/**
 * Remove REST API embed endpoint
 *
 * @since 1.0.0
 * @param array $endpoints REST API endpoints
 * @return array Modified endpoints
 */
add_filter('rest_endpoints', function ($endpoints) {
    unset($endpoints['/oembed/1.0/embed']);
    return $endpoints;
});
