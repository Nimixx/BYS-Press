<?php
/**
 * Disable Emojis Utility
 *
 * Removes emoji detection scripts and styles from WordPress
 * Significant performance improvement on both frontend and admin
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable emoji detection script
 *
 * @since 1.0.0
 * @return void
 */
add_action('init', function () {
    // Remove emoji detection from frontend
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');

    // Remove emoji detection from admin
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');

    // Remove emoji detection from feeds
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');

    // Remove emoji detection from emails
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');

    // Remove emoji DNS prefetch
    remove_filter('emoji_svg_url', '__return_false');
});

/**
 * Disable TinyMCE emojis plugin
 *
 * @since 1.0.0
 * @param array $plugins TinyMCE plugins
 * @return array Modified plugins
 */
add_filter('tiny_mce_plugins', function ($plugins) {
    if (is_array($plugins)) {
        return array_diff($plugins, ['wpemoji']);
    }
    return $plugins;
});

/**
 * Remove emoji DNS prefetch from wp_resource_hints
 *
 * @since 1.0.0
 * @param array $urls URLs for DNS prefetch
 * @param string $relationType Relation type
 * @return array Modified URLs
 */
add_filter('wp_resource_hints', function ($urls, $relationType) {
    if ($relationType === 'dns-prefetch') {
        $emojiUrl = 'https://s.w.org';
        $urls = array_filter($urls, function ($url) use ($emojiUrl) {
            return strpos($url, $emojiUrl) === false;
        });
    }
    return $urls;
}, 10, 2);
