<?php
/**
 * Button Component Context Helper
 *
 * Provides a type-safe way to create button component context
 *
 * @package BYSPress\Components
 * @since 1.0.0
 */

namespace BYSPress\Components;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

class Button
{
    /**
     * Create button context
     *
     * @param array $args {
     *     Button configuration
     *
     *     @type string $text Button text
     *     @type string $url Button URL (optional)
     *     @type string $variant Button variant: primary|secondary|outline|ghost
     *     @type string $size Button size: small|base|large
     *     @type bool $full_width Full width button
     *     @type bool $disabled Disabled state
     *     @type string $aria_label Accessibility label
     *     @type array $attributes Additional HTML attributes
     * }
     * @return array Button context for Twig
     */
    public static function context(array $args = []): array
    {
        return [
            'text' => $args['text'] ?? 'Button',
            'url' => $args['url'] ?? '',
            'variant' => $args['variant'] ?? 'primary',
            'size' => $args['size'] ?? 'base',
            'full_width' => $args['full_width'] ?? false,
            'disabled' => $args['disabled'] ?? false,
            'aria_label' => $args['aria_label'] ?? '',
            'attributes' => $args['attributes'] ?? [],
            'classes' => self::getClasses($args),
        ];
    }

    /**
     * Generate CSS classes based on configuration
     *
     * @param array $args Button configuration
     * @return string Space-separated CSS classes
     */
    private static function getClasses(array $args): string
    {
        $classes = ['button'];

        // Add variant class
        if (isset($args['variant']) && $args['variant'] !== 'primary') {
            $classes[] = "button--{$args['variant']}";
        }

        // Add size class
        if (isset($args['size']) && $args['size'] !== 'base') {
            $classes[] = "button--{$args['size']}";
        }

        // Add full width modifier
        if (!empty($args['full_width'])) {
            $classes[] = 'button--full';
        }

        // Add custom classes
        if (!empty($args['class'])) {
            $classes[] = $args['class'];
        }

        return implode(' ', $classes);
    }

    /**
     * Create primary button
     *
     * @param string $text Button text
     * @param string $url Button URL
     * @param array $options Additional options
     * @return array Button context
     */
    public static function primary(string $text, string $url = '', array $options = []): array
    {
        return self::context(
            array_merge($options, [
                'text' => $text,
                'url' => $url,
                'variant' => 'primary',
            ]),
        );
    }

    /**
     * Create secondary button
     *
     * @param string $text Button text
     * @param string $url Button URL
     * @param array $options Additional options
     * @return array Button context
     */
    public static function secondary(string $text, string $url = '', array $options = []): array
    {
        return self::context(
            array_merge($options, [
                'text' => $text,
                'url' => $url,
                'variant' => 'secondary',
            ]),
        );
    }

    /**
     * Create outline button
     *
     * @param string $text Button text
     * @param string $url Button URL
     * @param array $options Additional options
     * @return array Button context
     */
    public static function outline(string $text, string $url = '', array $options = []): array
    {
        return self::context(
            array_merge($options, [
                'text' => $text,
                'url' => $url,
                'variant' => 'outline',
            ]),
        );
    }

    /**
     * Create ghost button
     *
     * @param string $text Button text
     * @param string $url Button URL
     * @param array $options Additional options
     * @return array Button context
     */
    public static function ghost(string $text, string $url = '', array $options = []): array
    {
        return self::context(
            array_merge($options, [
                'text' => $text,
                'url' => $url,
                'variant' => 'ghost',
            ]),
        );
    }
}
