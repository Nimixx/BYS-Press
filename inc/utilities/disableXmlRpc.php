<?php
/**
 * Disable XML-RPC Utility
 *
 * Disables WordPress XML-RPC functionality for improved security and performance
 * XML-RPC is often targeted by brute force attacks and is rarely needed
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable XML-RPC
 *
 * @since 1.0.0
 * @return bool
 */
add_filter('xmlrpc_enabled', '__return_false');

/**
 * Remove XML-RPC RSD link from wp_head
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    remove_action('wp_head', 'rsd_link');
});

/**
 * Remove X-Pingback HTTP header
 *
 * @since 1.0.0
 * @param array $headers HTTP headers
 * @return array Modified headers
 */
add_filter('wp_headers', function ($headers) {
    unset($headers['X-Pingback']);
    return $headers;
});

/**
 * Disable XML-RPC methods
 *
 * @since 1.0.0
 * @param array $methods XML-RPC methods
 * @return array Empty array of methods
 */
add_filter('xmlrpc_methods', function ($methods) {
    return [];
});

/**
 * Block XML-RPC requests completely
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    if (defined('XMLRPC_REQUEST') && XMLRPC_REQUEST) {
        wp_die(
            'XML-RPC services are disabled on this site.',
            'XML-RPC Disabled',
            ['response' => 403]
        );
    }
});
