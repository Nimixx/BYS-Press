<?php
/**
 * Menu Configuration
 *
 * Defines the primary navigation menu structure for the theme.
 * This configuration is loaded into the Timber context and used in Header component.
 *
 * @package BYSPress\Config
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

return [
    [
        'title' => 'Home',
        'url' => '/',
    ],
    [
        'title' => 'About',
        'url' => '/about',
    ],
    [
        'title' => 'Services',
        'url' => '/services',
        'children' => [
            [
                'title' => 'Web Development',
                'url' => '/services/web-development',
            ],
            [
                'title' => 'Design',
                'url' => '/services/design',
            ],
            [
                'title' => 'Consulting',
                'url' => '/services/consulting',
            ],
            [
                'title' => 'SEO',
                'url' => '/services/seo',
            ],
        ],
    ],
    [
        'title' => 'Blog',
        'url' => '/blog',
    ],
    [
        'title' => 'Contact',
        'url' => '/contact',
    ],
];
