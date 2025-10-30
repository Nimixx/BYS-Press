<?php
/**
 * Assets Configuration
 *
 * Defines paths to static assets (images, logos, etc.)
 * Paths are relative to the theme directory
 *
 * @package CoreTheme\Config
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

return [
    // Logo configuration
    'logo' => [
        'path' => '/assets/images/logo.svg',
        'alt' => 'Logo - Fiscal Simplicity Development Platform',
    ],

    // Top Bar configuration (optional - shown above main header)
    'topbar' => [
        'enabled' => true,
        'phone' => '+1 (555) 123-4567',
        'email' => 'info@example.com',
        'message' => null, // Optional announcement message
        'social_links' => [
            [
                'name' => 'Facebook',
                'label' => 'Visit our Facebook page',
                'url' => 'https://facebook.com',
                'icon' => '<svg width="16" height="16" fill="currentColor"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>',
            ],
            [
                'name' => 'Twitter',
                'label' => 'Visit our Twitter page',
                'url' => 'https://twitter.com',
                'icon' => '<svg width="16" height="16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>',
            ],
        ],
    ],

    // Other asset paths can be added here
    // Example:
    // 'favicon' => '/assets/images/favicon.ico',
    // 'default_image' => '/assets/images/placeholder.jpg',
];
