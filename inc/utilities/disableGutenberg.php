<?php
/**
 * Disable Gutenberg Editor Utility
 *
 * Disables the Gutenberg block editor and restores the classic editor
 *
 * @package BYSPress
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable Gutenberg editor
 *
 * @since 1.0.0
 * @param bool $useBlockEditor Whether to use block editor
 * @param string $postType Post type being edited
 * @return bool
 */
add_filter('use_block_editor_for_post_type', function ($useBlockEditor, $postType) {
    // Disable for all post types
    return false;

    // Or disable for specific post types only:
    // $disabledPostTypes = ['post', 'page'];
    // return in_array($postType, $disabledPostTypes) ? false : $useBlockEditor;
}, 10, 2);

/**
 * Disable Gutenberg for widgets
 *
 * @since 1.0.0
 * @return bool
 */
add_filter('use_widgets_block_editor', '__return_false');
