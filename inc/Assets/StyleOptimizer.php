<?php
/**
 * Style Optimizer
 *
 * Optimizes style tags with font-display and other performance optimizations
 *
 * @package CoreTheme\Assets
 * @since 1.0.0
 */

namespace CoreTheme\Assets;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

class StyleOptimizer
{
    /**
     * Enable font optimization
     *
     * @var bool
     */
    private bool $optimizeFonts = true;

    /**
     * Initialize style optimization
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        add_filter('style_loader_tag', [$this, 'optimizeStyleTag'], 10, 2);

        if ($this->optimizeFonts) {
            add_filter('wp_resource_hints', [$this, 'addFontPreconnect'], 10, 2);
        }
    }

    /**
     * Optimize style tags
     *
     * @since 1.0.0
     * @param string $tag Style tag HTML
     * @param string $handle Style handle
     * @return string Modified style tag
     */
    public function optimizeStyleTag(string $tag, string $handle): string
    {
        // Add font-display: swap to font stylesheets
        if (
            $this->optimizeFonts &&
            (strpos($handle, 'font') !== false || strpos($tag, 'fonts.googleapis.com') !== false)
        ) {
            // For Google Fonts, add display=swap parameter
            if (
                strpos($tag, 'fonts.googleapis.com') !== false &&
                strpos($tag, 'display=swap') === false
            ) {
                $tag = str_replace('css?family=', 'css?display=swap&family=', $tag);
            }
        }

        return $tag;
    }

    /**
     * Add font preconnect hints
     *
     * @since 1.0.0
     * @param array $urls Resource hint URLs
     * @param string $relation_type Type of resource hint
     * @return array Modified URLs
     */
    public function addFontPreconnect(array $urls, string $relation_type): array
    {
        if ($relation_type === 'preconnect') {
            $urls[] = [
                'href' => 'https://fonts.googleapis.com',
                'crossorigin' => 'anonymous',
            ];
            $urls[] = [
                'href' => 'https://fonts.gstatic.com',
                'crossorigin' => 'anonymous',
            ];
        }

        return $urls;
    }

    /**
     * Enable or disable font optimization
     *
     * @since 1.0.0
     * @param bool $enable
     * @return self
     */
    public function setFontOptimization(bool $enable): self
    {
        $this->optimizeFonts = $enable;
        return $this;
    }
}
