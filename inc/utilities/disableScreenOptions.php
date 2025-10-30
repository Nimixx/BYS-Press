<?php
/**
 * Disable Screen Options Utility
 *
 * Removes Screen Options tab and Help tab from admin pages for cleaner UI
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Remove Screen Options tab from all admin pages
 *
 * @since 1.0.0
 * @return void
 */
add_filter('screen_options_show_screen', '__return_false');

/**
 * Remove Help tab from all admin pages
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_head', function () {
    $screen = get_current_screen();
    if ($screen) {
        $screen->remove_help_tabs();
    }
});

/**
 * Hide Screen Options CSS for extra cleanup
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_head', function () {
    echo '<style>
        /* Hide Screen Options button */
        #screen-options-link-wrap,
        #contextual-help-link-wrap {
            display: none !important;
        }

        /* Hide Screen Options panel if somehow visible */
        #screen-options-wrap,
        #contextual-help-wrap {
            display: none !important;
        }

        /* Adjust admin header spacing */
        #screen-meta-links {
            display: none !important;
        }

        /* Remove empty space where buttons were */
        #screen-meta {
            display: none !important;
        }
    </style>';
});

/**
 * Optional: Allow for administrators only
 *
 * Uncomment this block if you want to show Screen Options only to administrators
 *
 * @since 1.0.0
 * @return void
 */
/*
add_filter('screen_options_show_screen', function ($show_screen) {
    if (current_user_can('manage_options')) {
        return true; // Show for administrators
    }
    return false; // Hide for all other roles
});
*/
