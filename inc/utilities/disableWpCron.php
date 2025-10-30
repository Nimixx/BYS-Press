<?php
/**
 * Disable WP Cron Utility
 *
 * Disables WordPress built-in cron system (WP-Cron) and uses system cron instead
 *
 * WP-Cron runs on every page load, which:
 * - Slows down page load for visitors
 * - Can miss scheduled tasks if site has low traffic
 * - Uses PHP instead of system resources
 *
 * System cron is more reliable and doesn't impact page load
 *
 * PERFORMANCE BENEFIT:
 * - Faster page loads (no cron check on every request)
 * - More reliable scheduled tasks
 * - Lower server resource usage
 * - Better for high-traffic sites
 *
 * IMPORTANT: You must set up system cron after enabling this!
 *
 * @package CoreTheme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Disable WP-Cron
 *
 * This constant should ideally be in wp-config.php, but we set it here
 * for theme-level control
 *
 * IMPORTANT: After enabling this utility, you MUST set up system cron!
 * See README.md in inc/utilities/ folder for setup instructions.
 *
 * @since 1.0.0
 */
if (!defined('DISABLE_WP_CRON')) {
    define('DISABLE_WP_CRON', true);
}

/**
 * Add cron info to Site Health
 *
 * @since 1.0.0
 * @param array $tests Site Health tests
 * @return array Modified tests
 */
add_filter('site_status_tests', function ($tests) {
    $tests['direct']['wp_cron_disabled'] = [
        'label' => __('WP-Cron Status'),
        'test' => function () {
            $result = [
                'label' => __('WP-Cron is properly disabled'),
                'status' => 'good',
                'badge' => [
                    'label' => __('Performance'),
                    'color' => 'blue',
                ],
                'description' => sprintf(
                    '<p>%s</p>',
                    __('WP-Cron has been disabled in favor of system cron for better performance.')
                ),
                'actions' => '',
                'test' => 'wp_cron_disabled',
            ];

            if (!defined('DISABLE_WP_CRON') || !DISABLE_WP_CRON) {
                $result['status'] = 'recommended';
                $result['label'] = __('WP-Cron is still enabled');
                $result['description'] = sprintf(
                    '<p>%s</p>',
                    __('Consider disabling WP-Cron and using system cron for better performance.')
                );
            }

            return $result;
        },
    ];

    return $tests;
});
