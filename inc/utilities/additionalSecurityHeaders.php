<?php
/**
 * Additional Security Headers Utility
 *
 * Adds modern security headers that complement the main HeaderSecurity class
 * These headers provide defense-in-depth protection
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Send additional security headers
 *
 * @since 1.0.0
 * @return void
 */
add_action('send_headers', function () {
    // Prevent headers from being sent twice
    if (headers_sent()) {
        return;
    }

    /**
     * X-Download-Options: noopen
     *
     * Prevents Internet Explorer from executing downloads in your site's context
     * Prevents old IE versions from opening files directly in the browser
     */
    header('X-Download-Options: noopen');

    /**
     * X-Permitted-Cross-Domain-Policies: none
     *
     * Prevents Adobe Flash and PDF files from accessing data across domains
     * Blocks cross-domain policy file loading
     */
    header('X-Permitted-Cross-Domain-Policies: none');

    /**
     * X-DNS-Prefetch-Control: off
     *
     * Disables DNS prefetching to prevent privacy leaks
     * Browsers won't resolve DNS for external links before user clicks
     */
    header('X-DNS-Prefetch-Control: off');

    /**
     * Expect-CT: enforce
     *
     * Enforces Certificate Transparency to detect mis-issued certificates
     * Helps prevent man-in-the-middle attacks with fake certificates
     */
    if (is_ssl()) {
        header('Expect-CT: enforce, max-age=86400');
    }

    /**
     * Cross-Origin-Embedder-Policy: require-corp
     *
     * Prevents loading cross-origin resources that don't grant permission
     * Note: This can break embedding - use cautiously
     */
    // Uncomment if needed (may break external embeds):
    // header('Cross-Origin-Embedder-Policy: require-corp');

    /**
     * Cross-Origin-Opener-Policy: same-origin
     *
     * Isolates browsing context from cross-origin documents
     * Prevents window.opener access from popups
     */
    header('Cross-Origin-Opener-Policy: same-origin');

    /**
     * Cross-Origin-Resource-Policy: same-origin
     *
     * Prevents other domains from reading your resources
     * Protects against Spectre-like attacks
     */
    header('Cross-Origin-Resource-Policy: same-origin');

    /**
     * Feature-Policy (deprecated but still useful for older browsers)
     *
     * Controls which browser features can be used
     * Being replaced by Permissions-Policy but still supported
     */
    header(
        "Feature-Policy: " .
        "geolocation 'none'; " .
        "microphone 'none'; " .
        "camera 'none'; " .
        "payment 'none'; " .
        "usb 'none'; " .
        "magnetometer 'none'; " .
        "gyroscope 'none'; " .
        "accelerometer 'none'"
    );
});

/**
 * Remove server signature from headers
 *
 * Hides server software version to reduce information disclosure
 *
 * @since 1.0.0
 * @return void
 */
add_filter('wp_headers', function ($headers) {
    // Remove server signature if present
    if (isset($headers['Server'])) {
        unset($headers['Server']);
    }

    // Remove powered by headers that might leak technology info
    if (isset($headers['X-Powered-By'])) {
        unset($headers['X-Powered-By']);
    }

    return $headers;
});

/**
 * Disable XMLRPC discovery via HTTP headers
 *
 * @since 1.0.0
 * @return void
 */
add_filter('wp_headers', function ($headers) {
    // Remove X-Pingback header (redundant with disableXmlRpc.php but ensures removal)
    unset($headers['X-Pingback']);

    return $headers;
});

/**
 * Set secure cookie flags
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    // Force secure cookies on HTTPS
    if (is_ssl() && !defined('SECURE_AUTH_COOKIE')) {
        define('SECURE_AUTH_COOKIE', true);
    }

    // HttpOnly cookies (prevent JavaScript access)
    if (!defined('COOKIE_HTTPONLY')) {
        define('COOKIE_HTTPONLY', true);
    }
}, 1);

/**
 * Add SameSite cookie attribute
 *
 * Protects against CSRF attacks
 *
 * @since 1.0.0
 * @return void
 */
add_filter('wp_samesite_cookie', function ($samesite) {
    // Strict: cookie only sent to same site
    // Lax: cookie sent on top-level navigation (default)
    // None: cookie sent with all requests (requires Secure flag)
    return 'Strict';
});

/**
 * Security information for admin
 *
 * Adds helpful security info to admin dashboard
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_notices', function () {
    // Only show to administrators
    if (!current_user_can('manage_options')) {
        return;
    }

    // Check if we're on HTTPS
    if (!is_ssl()) {
        echo '<div class="notice notice-warning">
            <p><strong>Security Warning:</strong> Your site is not using HTTPS.
            Many security headers (like HSTS and Expect-CT) require HTTPS to work properly.</p>
        </div>';
    }
});
