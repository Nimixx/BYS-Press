<?php
/**
 * Assets Class
 *
 * Main orchestrator for theme asset management
 * Delegates to specialized components for different concerns
 *
 * @package CoreTheme
 * @since 1.0.0
 */

namespace CoreTheme;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

use CoreTheme\Assets\AssetEnqueuer;
use CoreTheme\Assets\ScriptOptimizer;
use CoreTheme\Assets\StyleOptimizer;
use CoreTheme\Assets\CriticalCssHandler;
use CoreTheme\Assets\ResourceHints;

class Assets
{
    /**
     * Asset enqueuer component
     *
     * @var AssetEnqueuer
     */
    private AssetEnqueuer $enqueuer;

    /**
     * Script optimizer component
     *
     * @var ScriptOptimizer
     */
    private ScriptOptimizer $scriptOptimizer;

    /**
     * Style optimizer component
     *
     * @var StyleOptimizer
     */
    private StyleOptimizer $styleOptimizer;

    /**
     * Critical CSS handler component
     *
     * @var CriticalCssHandler
     */
    private CriticalCssHandler $criticalCssHandler;

    /**
     * Resource hints component
     *
     * @var ResourceHints
     */
    private ResourceHints $resourceHints;

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param string|null $themeDir Optional theme directory path
     */
    public function __construct(?string $themeDir = null)
    {
        $themeDir = $themeDir ?? get_template_directory();

        // Initialize components
        $this->enqueuer = new AssetEnqueuer($themeDir);
        $this->scriptOptimizer = new ScriptOptimizer();
        $this->styleOptimizer = new StyleOptimizer();
        $this->criticalCssHandler = new CriticalCssHandler($themeDir);
        $this->resourceHints = new ResourceHints();
    }

    /**
     * Initialize all asset components
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        $this->enqueuer->init();
        $this->scriptOptimizer->init();
        $this->styleOptimizer->init();
        $this->criticalCssHandler->init();
        $this->resourceHints->init();
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
        $this->criticalCssHandler->setCriticalCss($css);
        return $this;
    }

    /**
     * Add script to be deferred
     *
     * @since 1.0.0
     * @param string $handle Script handle
     * @return self
     */
    public function addDeferredScript(string $handle): self
    {
        $this->scriptOptimizer->addDeferredScript($handle);
        return $this;
    }

    /**
     * Add script to be loaded async
     *
     * @since 1.0.0
     * @param string $handle Script handle
     * @return self
     */
    public function addAsyncScript(string $handle): self
    {
        $this->scriptOptimizer->addAsyncScript($handle);
        return $this;
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
        $this->resourceHints->addPreloadResource($url, $type, $options);
        return $this;
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
        $this->styleOptimizer->setFontOptimization($enable);
        return $this;
    }

    /**
     * Get theme directory path
     *
     * @since 1.0.0
     * @return string
     */
    public function getThemeDir(): string
    {
        return $this->enqueuer->getThemeDir();
    }

    /**
     * Get deferred scripts
     *
     * @since 1.0.0
     * @return array
     */
    public function getDeferredScripts(): array
    {
        return $this->scriptOptimizer->getDeferredScripts();
    }

    /**
     * Get async scripts
     *
     * @since 1.0.0
     * @return array
     */
    public function getAsyncScripts(): array
    {
        return $this->scriptOptimizer->getAsyncScripts();
    }
}
