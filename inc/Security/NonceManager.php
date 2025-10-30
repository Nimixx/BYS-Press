<?php
/**
 * Nonce Manager
 *
 * Handles CSP nonce generation and injection into inline scripts/styles
 *
 * @package BYSPress\Security
 * @since 1.0.0
 */

namespace BYSPress\Security;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

class NonceManager
{
    /**
     * CSP nonce for inline scripts and styles
     *
     * @var string|null
     */
    private ?string $cspNonce = null;

    /**
     * Initialize nonce management
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        // Generate nonce early
        add_action('init', [$this, 'generateNonce'], 1);

        // Add nonce to inline scripts and styles
        add_filter('script_loader_tag', [$this, 'addNonceToScript'], 10, 2);
        add_filter('style_loader_tag', [$this, 'addNonceToStyle'], 10, 2);
    }

    /**
     * Generate CSP nonce
     *
     * @since 1.0.0
     * @return void
     */
    public function generateNonce(): void
    {
        if ($this->cspNonce === null) {
            $this->cspNonce = base64_encode(random_bytes(16));
        }
    }

    /**
     * Get CSP nonce
     *
     * @since 1.0.0
     * @return string
     */
    public function getNonce(): string
    {
        if ($this->cspNonce === null) {
            $this->generateNonce();
        }
        return $this->cspNonce;
    }

    /**
     * Add nonce attribute to script tags
     *
     * @since 1.0.0
     * @param string $tag
     * @param string $handle
     * @return string
     */
    public function addNonceToScript(string $tag, string $handle): string
    {
        // Only add nonce to inline scripts
        if (strpos($tag, '</script>') !== false && strpos($tag, 'src=') === false) {
            $nonce = $this->getNonce();
            $tag = str_replace('<script', '<script nonce="' . esc_attr($nonce) . '"', $tag);
        }
        return $tag;
    }

    /**
     * Add nonce attribute to style tags
     *
     * @since 1.0.0
     * @param string $tag
     * @param string $handle
     * @return string
     */
    public function addNonceToStyle(string $tag, string $handle): string
    {
        // Only add nonce to inline styles
        if (strpos($tag, '</style>') !== false) {
            $nonce = $this->getNonce();
            $tag = str_replace('<style', '<style nonce="' . esc_attr($nonce) . '"', $tag);
        }
        return $tag;
    }
}
