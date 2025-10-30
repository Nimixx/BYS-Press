<?php
/**
 * BYS Press Theme Bootstrap
 *
 * This file initializes the theme using an object-oriented architecture
 *
 * @package BYSPress
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

// Load Composer dependencies
require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap the theme
$bysPress = new BYSPress\Theme();
$bysPress->boot();

/**
 * Get the theme instance
 *
 * Provides global access to the theme instance for extending functionality
 *
 * @since 1.0.0
 * @return BYSPress\Theme
 */
function bys_press(): BYSPress\Theme
{
    global $bysPress;
    return $bysPress;
}
