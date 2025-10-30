<?php
/**
 * Disable Pingbacks Utility
 *
 * Disables pingbacks and trackbacks to prevent:
 * - DDoS attacks via XML-RPC pingback
 * - Spam pingbacks
 * - Server resource abuse
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable XML-RPC pingback method
 *
 * This is the most common attack vector
 *
 * @since 1.0.0
 * @param array $methods Available XML-RPC methods
 * @return array Modified methods without pingback
 */
add_filter('xmlrpc_methods', function ($methods) {
    // Remove pingback.ping and pingback.extensions.getPingbacks
    unset($methods['pingback.ping']);
    unset($methods['pingback.extensions.getPingbacks']);
    return $methods;
});

/**
 * Disable pingbacks on all posts
 *
 * @since 1.0.0
 * @param bool $open Whether pings are open
 * @return bool Always false
 */
add_filter('pings_open', '__return_false', 20);

/**
 * Remove X-Pingback header
 *
 * Prevents disclosure that site accepts pingbacks
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
 * Disable self-pingbacks
 *
 * Prevents your own site from pingback itself
 *
 * @since 1.0.0
 * @param array $links Links found in post content
 * @return array Filtered links
 */
add_action('pre_ping', function (&$links) {
    $home = get_option('home');
    foreach ($links as $l => $link) {
        if (strpos($link, $home) === 0) {
            unset($links[$l]);
        }
    }
});

/**
 * Block pingback requests at server level
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_SERVER['HTTP_USER_AGENT'])) {
            // Block common pingback user agents
            $blocked_agents = [
                'pingback',
                'Pingback',
                'xmlrpc',
            ];

            foreach ($blocked_agents as $agent) {
                if (stripos($_SERVER['HTTP_USER_AGENT'], $agent) !== false) {
                    wp_die(
                        'Pingbacks are disabled on this site.',
                        'Pingbacks Disabled',
                        ['response' => 403]
                    );
                }
            }
        }
    }
});

/**
 * Remove pingback link from wp_head
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    remove_action('wp_head', 'rsd_link');
});
