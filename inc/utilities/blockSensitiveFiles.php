<?php
/**
 * Block Sensitive Files Utility
 *
 * Prevents access to sensitive files that can reveal:
 * - WordPress version
 * - Server configuration
 * - Plugin/theme information
 * - Backup files
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Block access to sensitive files via WordPress
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    // Get the requested URI
    $request_uri = $_SERVER['REQUEST_URI'] ?? '';

    // List of sensitive files to block
    $blocked_files = [
        'readme.html',          // WordPress version info
        'license.txt',          // WordPress license
        'wp-config.php',        // Database credentials
        'wp-config-sample.php', // Sample config
        '.htaccess',            // Server config
        'error_log',            // Error logs
        'debug.log',            // Debug logs
        'php.ini',              // PHP config
        '.user.ini',            // PHP config
        'xmlrpc.php',           // Already blocked elsewhere
    ];

    // Block backup files (common patterns)
    $backup_patterns = [
        '.bak',
        '.backup',
        '.old',
        '.orig',
        '.save',
        '.swp',
        '.tmp',
        '~',
        '.sql',
        '.zip',
        '.tar',
        '.tar.gz',
        '.log',
    ];

    // Check for exact file matches
    foreach ($blocked_files as $file) {
        if (stripos($request_uri, $file) !== false) {
            wp_die(
                'Access to this file is forbidden.',
                'Forbidden',
                ['response' => 403]
            );
        }
    }

    // Check for backup file patterns
    foreach ($backup_patterns as $pattern) {
        if (stripos($request_uri, $pattern) !== false) {
            // Only block if it looks like a backup of a PHP or config file
            if (stripos($request_uri, '.php') !== false ||
                stripos($request_uri, 'config') !== false ||
                stripos($request_uri, 'wp-') !== false) {
                wp_die(
                    'Access to backup files is forbidden.',
                    'Forbidden',
                    ['response' => 403]
                );
            }
        }
    }
});

