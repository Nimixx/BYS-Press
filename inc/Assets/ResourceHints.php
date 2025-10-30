<?php
/**
 * Resource Hints
 *
 * Manages resource hints (preload, prefetch, preconnect) for performance
 *
 * @package CoreTheme\Assets
 * @since 1.0.0
 */

namespace CoreTheme\Assets;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

class ResourceHints
{
    /**
     * Resources to preload
     *
     * @var array
     */
    private array $preloadResources = [];

    /**
     * Initialize resource hints
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        add_action('wp_head', [$this, 'addResourceHints'], 2);
    }

    /**
     * Add resource hints (preload, prefetch, preconnect)
     *
     * @since 1.0.0
     * @return void
     */
    public function addResourceHints(): void
    {
        foreach ($this->preloadResources as $resource) {
            $type = $resource['type'] ?? 'script';
            $as = $resource['as'] ?? $type;
            $crossorigin = isset($resource['crossorigin']) ? ' crossorigin' : '';

            echo sprintf(
                '<link rel="preload" href="%s" as="%s"%s>' . "\n",
                esc_url($resource['url']),
                esc_attr($as),
                $crossorigin,
            );
        }
    }

    /**
     * Add resource to preload
     *
     * @since 1.0.0
     * @param string $url Resource URL
     * @param string $type Resource type (script, style, font, image)
     * @param array $options Additional options (as, crossorigin)
     * @return self
     */
    public function addPreloadResource(
        string $url,
        string $type = 'script',
        array $options = [],
    ): self {
        $this->preloadResources[] = array_merge(
            [
                'url' => $url,
                'type' => $type,
            ],
            $options,
        );
        return $this;
    }
}
