<?php
/**
 * Card Component Context Helper
 *
 * Provides a type-safe way to create card component context
 *
 * @package CoreTheme\Components
 * @since 1.0.0
 */

namespace CoreTheme\Components;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

class Card
{
    /**
     * Create card context
     *
     * @param array $args {
     *     Card configuration
     *
     *     @type string $title Card title
     *     @type string $description Card description
     *     @type string $image Image URL
     *     @type string $url Card link URL
     *     @type string $cta_text Call-to-action text
     *     @type string $variant Card variant: default|featured
     *     @type string $class Additional CSS classes
     * }
     * @return array Card context for Twig
     */
    public static function context(array $args = []): array
    {
        return [
            'title' => $args['title'] ?? '',
            'description' => $args['description'] ?? '',
            'image' => $args['image'] ?? '',
            'url' => $args['url'] ?? '',
            'cta_text' => $args['cta_text'] ?? 'Learn More',
            'variant' => $args['variant'] ?? 'default',
            'classes' => self::getClasses($args),
        ];
    }

    /**
     * Generate CSS classes based on configuration
     *
     * @param array $args Card configuration
     * @return string Space-separated CSS classes
     */
    private static function getClasses(array $args): string
    {
        $classes = ['card'];

        // Add variant class
        if (isset($args['variant']) && $args['variant'] !== 'default') {
            $classes[] = "card--{$args['variant']}";
        }

        // Add custom classes
        if (!empty($args['class'])) {
            $classes[] = $args['class'];
        }

        return implode(' ', $classes);
    }

    /**
     * Create card from WordPress post
     *
     * @param \WP_Post $post WordPress post object
     * @param array $options Additional options
     * @return array Card context
     */
    public static function fromPost(\WP_Post $post, array $options = []): array
    {
        return self::context([
            'title' => get_the_title($post),
            'description' => get_the_excerpt($post),
            'image' => get_the_post_thumbnail_url($post, 'large'),
            'url' => get_permalink($post),
            'cta_text' => $options['cta_text'] ?? 'Read More',
            'variant' => $options['variant'] ?? 'default',
            'class' => $options['class'] ?? '',
        ]);
    }

    /**
     * Create multiple cards from WordPress posts
     *
     * @param array $posts Array of WP_Post objects
     * @param array $options Additional options
     * @return array Array of card contexts
     */
    public static function fromPosts(array $posts, array $options = []): array
    {
        return array_map(fn($post) => self::fromPost($post, $options), $posts);
    }

    /**
     * Create featured card
     *
     * @param string $title Card title
     * @param string $description Card description
     * @param array $options Additional options
     * @return array Card context
     */
    public static function featured(string $title, string $description, array $options = []): array
    {
        return self::context(
            array_merge($options, [
                'title' => $title,
                'description' => $description,
                'variant' => 'featured',
            ]),
        );
    }
}
