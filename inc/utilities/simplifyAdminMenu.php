<?php
/**
 * Simplify Admin Menu Utility
 *
 * Removes unused WordPress admin menu items for cleaner navigation
 * Configure which menu items to remove using the array below
 *
 * PERFORMANCE BENEFIT:
 * - Cleaner admin interface
 * - Faster navigation
 * - Less clutter for content editors
 * - Improved user experience
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * ====================================================================
 * CONFIGURATION: Menu Items to Remove
 * ====================================================================
 *
 * Set to TRUE to REMOVE the menu item from admin
 * Set to FALSE to KEEP the menu item visible
 *
 * Easily enable/disable menu items by changing true/false values
 */
$menu_items_to_remove = [
    // Content Management
    'posts'           => true,   // Posts (blog posts)
    'media'           => false,  // Media Library (images, files)
    'pages'           => false,  // Pages
    'comments'        => true,   // Comments

    // Appearance & Design
    'themes'          => false,  // Themes (under Appearance)
    'customize'       => false,  // Customizer (under Appearance)
    'widgets'         => true,   // Widgets (under Appearance)
    'menus'           => false,  // Menus (under Appearance)

    // Plugins & Extensions
    'plugins'         => false,  // Plugins

    // User Management
    'users'           => false,  // Users
    'profile'         => false,  // Profile (user's own profile)

    // System & Tools
    'tools'           => true,   // Tools
    'settings'        => false,  // Settings

    // Third-party common items
    'edit-comments'   => true,   // Edit Comments (submenu)
];

/**
 * Remove admin menu items based on configuration
 *
 * @since 1.0.0
 * @return void
 */
add_action('admin_menu', function () use ($menu_items_to_remove) {
    // Only apply for non-administrators (optional - remove this check to apply to all users)
    // Uncomment to hide menus only for non-admin roles:
    // if (current_user_can('manage_options')) {
    //     return;
    // }

    // Remove top-level menu pages
    if ($menu_items_to_remove['posts'] ?? false) {
        remove_menu_page('edit.php');
    }

    if ($menu_items_to_remove['media'] ?? false) {
        remove_menu_page('upload.php');
    }

    if ($menu_items_to_remove['pages'] ?? false) {
        remove_menu_page('edit.php?post_type=page');
    }

    if ($menu_items_to_remove['comments'] ?? false) {
        remove_menu_page('edit-comments.php');
    }

    if ($menu_items_to_remove['themes'] ?? false) {
        remove_menu_page('themes.php');
    }

    if ($menu_items_to_remove['plugins'] ?? false) {
        remove_menu_page('plugins.php');
    }

    if ($menu_items_to_remove['users'] ?? false) {
        remove_menu_page('users.php');
    }

    if ($menu_items_to_remove['tools'] ?? false) {
        remove_menu_page('tools.php');
    }

    if ($menu_items_to_remove['settings'] ?? false) {
        remove_menu_page('options-general.php');
    }

    // Remove Appearance submenus
    if ($menu_items_to_remove['customize'] ?? false) {
        remove_submenu_page('themes.php', 'customize.php');
    }

    if ($menu_items_to_remove['widgets'] ?? false) {
        remove_submenu_page('themes.php', 'widgets.php');
    }

    if ($menu_items_to_remove['menus'] ?? false) {
        remove_submenu_page('themes.php', 'nav-menus.php');
    }

    // Remove third-party plugin menus (common plugins)
    if ($menu_items_to_remove['wpcf7'] ?? false) {
        remove_menu_page('wpcf7');
    }

    if ($menu_items_to_remove['acf-options'] ?? false) {
        remove_menu_page('acf-options');
    }

    if ($menu_items_to_remove['edit-comments'] ?? false) {
        remove_submenu_page('edit-comments.php', 'edit-comments.php');
    }
}, 999);

/**
 * Remove admin bar items for cleaner top bar
 *
 * @since 1.0.0
 * @param WP_Admin_Bar $wp_admin_bar Admin bar instance
 * @return void
 */
add_action('admin_bar_menu', function ($wp_admin_bar) use ($menu_items_to_remove) {
    // Remove comments from admin bar if comments are disabled
    if ($menu_items_to_remove['comments'] ?? false) {
        $wp_admin_bar->remove_node('comments');
    }

    // Remove new post from admin bar if posts are disabled
    if ($menu_items_to_remove['posts'] ?? false) {
        $wp_admin_bar->remove_node('new-post');
    }

    // Remove customize from admin bar if customizer is disabled
    if ($menu_items_to_remove['customize'] ?? false) {
        $wp_admin_bar->remove_node('customize');
    }

    // Remove themes from admin bar if themes are disabled
    if ($menu_items_to_remove['themes'] ?? false) {
        $wp_admin_bar->remove_node('themes');
    }
}, 999);

/**
 * Optional: Hide specific menu items for specific user roles
 *
 * Uncomment and customize this function if you want role-based menu control
 *
 * @since 1.0.0
 * @return void
 */
/*
add_action('admin_menu', function () {
    $user = wp_get_current_user();

    // Example: Hide settings for editors
    if (in_array('editor', $user->roles)) {
        remove_menu_page('options-general.php');
        remove_menu_page('tools.php');
    }

    // Example: Hide plugins for authors
    if (in_array('author', $user->roles)) {
        remove_menu_page('plugins.php');
        remove_menu_page('themes.php');
    }
}, 999);
*/

/**
 * Add custom admin menu items (optional)
 *
 * Uncomment if you want to add custom menu links
 *
 * @since 1.0.0
 * @return void
 */
/*
add_action('admin_menu', function () {
    add_menu_page(
        'Custom Section',              // Page title
        'Custom',                      // Menu title
        'edit_posts',                  // Capability required
        'custom-section',              // Menu slug
        function () {                  // Callback function
            echo '<div class="wrap">';
            echo '<h1>Custom Section</h1>';
            echo '<p>Add your custom admin content here.</p>';
            echo '</div>';
        },
        'dashicons-admin-generic',     // Icon
        30                             // Position
    );
}, 999);
*/
