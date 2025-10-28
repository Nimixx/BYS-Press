<?php
/**
 * Script Optimizer
 *
 * Optimizes script tags with defer/async attributes for performance
 *
 * @package CoreTheme\Assets
 * @since 1.0.0
 */

namespace CoreTheme\Assets;

class ScriptOptimizer
{
    /**
     * Scripts that should be deferred
     *
     * @var array
     */
    private array $deferredScripts = ['core-theme-main'];

    /**
     * Scripts that should be async
     *
     * @var array
     */
    private array $asyncScripts = [];

    /**
     * Initialize script optimization
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        add_filter('script_loader_tag', [$this, 'optimizeScriptTag'], 10, 2);
    }

    /**
     * Optimize script tags with defer/async attributes
     *
     * @since 1.0.0
     * @param string $tag Script tag HTML
     * @param string $handle Script handle
     * @return string Modified script tag
     */
    public function optimizeScriptTag(string $tag, string $handle): string
    {
        // Add defer attribute
        if (in_array($handle, $this->deferredScripts, true)) {
            $tag = str_replace(' src', ' defer src', $tag);
        }

        // Add async attribute
        if (in_array($handle, $this->asyncScripts, true)) {
            $tag = str_replace(' src', ' async src', $tag);
        }

        return $tag;
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
        $this->deferredScripts[] = $handle;
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
        $this->asyncScripts[] = $handle;
        return $this;
    }

    /**
     * Get deferred scripts
     *
     * @since 1.0.0
     * @return array
     */
    public function getDeferredScripts(): array
    {
        return $this->deferredScripts;
    }

    /**
     * Get async scripts
     *
     * @since 1.0.0
     * @return array
     */
    public function getAsyncScripts(): array
    {
        return $this->asyncScripts;
    }
}
