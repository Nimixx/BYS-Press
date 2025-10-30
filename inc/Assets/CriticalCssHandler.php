<?php
/**
 * Critical CSS Handler
 *
 * Handles inline critical CSS for above-the-fold content
 *
 * @package CoreTheme\Assets
 * @since 1.0.0
 */

namespace CoreTheme\Assets;

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
            echo '<style id="critical-css">' . $this->criticalCss . '</style>' . "\n";
            return;
        }

        // Check if critical CSS file exists
        $criticalCssPath = $this->themeDir . '/dist/critical.css';
        if (file_exists($criticalCssPath)) {
            $css = file_get_contents($criticalCssPath);
            echo '<style id="critical-css">' . $css . '</style>' . "\n";
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
