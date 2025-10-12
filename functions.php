<?php
/**
 * Core Theme Bootstrap
 *
 * This file initializes the theme using an object-oriented architecture
 *
 * @package CoreTheme
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Load Composer dependencies
require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap the theme
$coreTheme = new CoreTheme\Theme();
$coreTheme->boot();

/**
 * Get the theme instance
 *
 * Provides global access to the theme instance for extending functionality
 *
 * @return CoreTheme\Theme
 */
function core_theme(): CoreTheme\Theme
{
    global $coreTheme;
    return $coreTheme;
}
