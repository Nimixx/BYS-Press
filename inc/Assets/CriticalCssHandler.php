<?php
/**
 * Critical CSS Handler
 *
 * Handles inline critical CSS for above-the-fold content
 *
 * @package BYSPress\Assets
 * @since 1.0.0
 */

namespace BYSPress\Assets;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

class CriticalCssHandler
{
    /**
     * Theme directory path
     *
     * @var string
     */
    private string $themeDir;

    /**
     * Critical CSS content
     *
     * @var string|null
     */
    private ?string $criticalCss = null;

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param string $themeDir Theme directory path
     */
    public function __construct(string $themeDir)
    {
        $this->themeDir = $themeDir;
    }

    /**
     * Initialize critical CSS
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        add_action('wp_head', [$this, 'inlineCriticalCss'], 1);
    }

    /**
     * Inline critical CSS
     *
     * @since 1.0.0
     * @return void
     */
    public function inlineCriticalCss(): void
    {
        if ($this->criticalCss !== null) {
            // Strip any HTML tags for security, preserve CSS syntax
            $safeCss = wp_strip_all_tags($this->criticalCss);
            echo '<style id="critical-css">' . $safeCss . '</style>' . "\n";
            return;
        }

        // Check if critical CSS file exists
        $criticalCssPath = $this->themeDir . '/dist/critical.css';
        if (file_exists($criticalCssPath)) {
            $css = file_get_contents($criticalCssPath);
            // Strip any HTML tags for security, preserve CSS syntax
            $safeCss = wp_strip_all_tags($css);
            echo '<style id="critical-css">' . $safeCss . '</style>' . "\n";
        }
    }

    /**
     * Set critical CSS content
     *
     * @since 1.0.0
     * @param string $css Critical CSS content
     * @return self
     */
    public function setCriticalCss(string $css): self
    {
        $this->criticalCss = $css;
        return $this;
    }
}
