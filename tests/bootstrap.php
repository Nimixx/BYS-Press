<?php
/**
 * PHPUnit Bootstrap File
 *
 * Sets up the testing environment
 */

// Load Composer autoloader
require_once dirname(__DIR__) . '/vendor/autoload.php';

// Initialize Brain Monkey for WordPress function mocking
\Brain\Monkey\setUp();

// Define WordPress constants for testing
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__DIR__) . '/');
}

if (!defined('WP_DEBUG')) {
    define('WP_DEBUG', true);
}

// Mock WordPress functions commonly used in themes
function __($text, $domain = 'default')
{
    return $text;
}

function esc_html($text)
{
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

function esc_attr($text)
{
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

function esc_url($url)
{
    return filter_var($url, FILTER_SANITIZE_URL);
}

function get_template_directory()
{
    return dirname(__DIR__);
}

function get_template_directory_uri()
{
    return 'http://example.com/wp-content/themes/core-theme';
}

function wp_enqueue_script($handle, $src = '', $deps = [], $ver = false, $in_footer = false)
{
    return true;
}

function wp_enqueue_style($handle, $src = '', $deps = [], $ver = false, $media = 'all')
{
    return true;
}

function add_action($hook, $callback, $priority = 10, $accepted_args = 1)
{
    return true;
}

function add_filter($hook, $callback, $priority = 10, $accepted_args = 1)
{
    return true;
}

function apply_filters($hook, $value, ...$args)
{
    return $value;
}

// Custom assertions or helper functions for tests can be added here
