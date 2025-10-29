<?php
/**
 * Disable File Editors Utility
 *
 * Disables the theme and plugin file editors in WordPress admin
 * Important security improvement for client sites
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable file editor for themes and plugins
 *
 * This prevents editing PHP files directly from WordPress admin,
 * reducing security risks from unauthorized code changes
 *
 * @since 1.0.0
 */
if (!defined('DISALLOW_FILE_EDIT')) {
    define('DISALLOW_FILE_EDIT', true);
}
