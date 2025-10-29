<?php
/**
 * Limit Post Revisions Utility
 *
 * Limits the number of post revisions saved in the database to reduce bloat
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Limit post revisions
 *
 * Defines the maximum number of revisions to keep per post
 * Set to 5 by default. Change the number below to adjust.
 *
 * To disable revisions completely, use: define('WP_POST_REVISIONS', false);
 *
 * @since 1.0.0
 */
if (!defined('WP_POST_REVISIONS')) {
    define('WP_POST_REVISIONS', 2);
}

/**
 * Auto-delete old revisions
 *
 * Cleans up excess revisions when a post is saved
 *
 * @since 1.0.0
 * @param int $postId Post ID
 * @return void
 */
add_action('save_post', function ($postId) {
    $revisions = wp_get_post_revisions($postId);

    if (count($revisions) > WP_POST_REVISIONS) {
        $revisionsToDelete = array_slice($revisions, WP_POST_REVISIONS);

        foreach ($revisionsToDelete as $revision) {
            wp_delete_post_revision($revision->ID);
        }
    }
}, 10, 1);
