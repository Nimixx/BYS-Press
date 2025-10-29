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
 * @param WP_Post $post Post object
 * @return void
 */
add_action('save_post', function ($postId, $post) {
    // Skip if autosave
    if (wp_is_post_autosave($postId)) {
        return;
    }

    // Skip if revision
    if (wp_is_post_revision($postId)) {
        return;
    }

    // Skip if WP_POST_REVISIONS is disabled or not numeric
    if (!is_numeric(WP_POST_REVISIONS) || WP_POST_REVISIONS === false) {
        return;
    }

    $revisions = wp_get_post_revisions($postId);

    if (count($revisions) > WP_POST_REVISIONS) {
        $revisionsToDelete = array_slice($revisions, WP_POST_REVISIONS);

        foreach ($revisionsToDelete as $revision) {
            wp_delete_post_revision($revision->ID);
        }
    }
}, 10, 2);
