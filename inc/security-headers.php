<?php
/**
 * Security Headers Configuration
 *
 * Adds security headers to protect against common vulnerabilities
 */

/**
 * Check if we're in production environment
 */
function core_theme_is_production() {
    // Check if WP_ENVIRONMENT_TYPE is set to production
    if (function_exists('wp_get_environment_type')) {
        return wp_get_environment_type() === 'production';
    }

    // Fallback: Check if we're NOT on local domains
    $local_domains = ['localhost', '127.0.0.1', '.local', '.test', '.dev'];
    $host = $_SERVER['HTTP_HOST'] ?? '';

    foreach ($local_domains as $local_domain) {
        if (strpos($host, $local_domain) !== false) {
            return false;
        }
    }

    // If WP_DEBUG is enabled, assume not production
    if (defined('WP_DEBUG') && WP_DEBUG) {
        return false;
    }

    return true;
}

/**
 * Send security headers
 */
function core_theme_send_security_headers() {
    // Prevent headers from being sent twice
    if (headers_sent()) {
        return;
    }

    // Only apply strict security headers in production
    if (!core_theme_is_production()) {
        return;
    }

    // X-Frame-Options: Prevents clickjacking attacks
    header('X-Frame-Options: SAMEORIGIN');

    // X-Content-Type-Options: Prevents MIME-sniffing attacks
    header('X-Content-Type-Options: nosniff');

    // X-XSS-Protection: Enables XSS filter in older browsers
    header('X-XSS-Protection: 1; mode=block');

    // Referrer-Policy: Controls referrer information sharing
    header('Referrer-Policy: strict-origin-when-cross-origin');

    // Permissions-Policy: Restricts access to sensitive APIs
    $permissions = [
        'geolocation=()',
        'microphone=()',
        'camera=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()',
    ];
    header('Permissions-Policy: ' . implode(', ', $permissions));

    // Content-Security-Policy: Main defense against XSS and injection attacks
    $csp_directives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "media-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
    ];

    // Apply CSP filter to allow customization
    $csp_directives = apply_filters('core_theme_csp_directives', $csp_directives);
    header('Content-Security-Policy: ' . implode('; ', $csp_directives));

    // Strict-Transport-Security: Forces HTTPS connections
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

// Send headers early in the WordPress lifecycle
add_action('send_headers', 'core_theme_send_security_headers');

/**
 * Remove WordPress version from headers for security
 */
add_filter('the_generator', '__return_empty_string');
remove_action('wp_head', 'wp_generator');

/**
 * Disable XML-RPC if not needed (prevents DDoS and brute force attacks)
 * Uncomment if you don't use XML-RPC functionality
 */
// add_filter('xmlrpc_enabled', '__return_false');

/**
 * Remove sensitive information from REST API
 */
add_filter('rest_authentication_errors', function ($result) {
    if (!is_user_logged_in()) {
        // Hide user enumeration via REST API for non-logged-in users
        add_filter('rest_endpoints', function ($endpoints) {
            if (isset($endpoints['/wp/v2/users'])) {
                unset($endpoints['/wp/v2/users']);
            }
            if (isset($endpoints['/wp/v2/users/(?P<id>[\d]+)'])) {
                unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
            }
            return $endpoints;
        });
    }
    return $result;
});

/**
 * Disable file editing in WordPress admin
 * Prevents attackers from modifying theme/plugin files if they gain admin access
 */
if (!defined('DISALLOW_FILE_EDIT')) {
    define('DISALLOW_FILE_EDIT', true);
}
