<?php
/**
 * Content Security Policy
 *
 * Manages Content-Security-Policy header with nonces and allowed domains
 *
 * @package BYSPress\Security
 * @since 1.0.0
 */

namespace BYSPress\Security;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

class ContentSecurityPolicy
{
    /**
     * Nonce manager instance
     *
     * @var NonceManager
     */
    private NonceManager $nonceManager;

    /**
     * Allowed external script domains
     *
     * @var array
     */
    private array $allowedScriptDomains = [];

    /**
     * Allowed external style domains
     *
     * @var array
     */
    private array $allowedStyleDomains = [];

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param NonceManager $nonceManager
     */
    public function __construct(NonceManager $nonceManager)
    {
        $this->nonceManager = $nonceManager;
    }

    /**
     * Initialize Content Security Policy
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        add_action('send_headers', [$this, 'sendContentSecurityPolicy']);
    }

    /**
     * Send Content-Security-Policy header
     *
     * @since 1.0.0
     * @return void
     */
    public function sendContentSecurityPolicy(): void
    {
        // Prevent headers from being sent twice
        if (headers_sent()) {
            return;
        }

        $nonce = $this->nonceManager->getNonce();

        // Build script-src with nonce and allowed domains
        $scriptSrc = ["'self'", "'nonce-{$nonce}'"];
        if (!empty($this->allowedScriptDomains)) {
            $scriptSrc = array_merge($scriptSrc, $this->allowedScriptDomains);
        }

        // Build style-src with nonce and allowed domains
        $styleSrc = ["'self'", "'nonce-{$nonce}'"];
        if (!empty($this->allowedStyleDomains)) {
            $styleSrc = array_merge($styleSrc, $this->allowedStyleDomains);
        }

        $cspDirectives = [
            "default-src 'self'",
            'script-src ' . implode(' ', $scriptSrc),
            'style-src ' . implode(' ', $styleSrc),
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "media-src 'self'",
            "object-src 'none'",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            'upgrade-insecure-requests',
        ];

        // Apply CSP filter to allow customization
        $cspDirectives = apply_filters('bys_press_csp_directives', $cspDirectives, $nonce);
        header('Content-Security-Policy: ' . implode('; ', $cspDirectives));
    }

    /**
     * Add allowed script domain
     *
     * @since 1.0.0
     * @param string $domain
     * @return self
     */
    public function addAllowedScriptDomain(string $domain): self
    {
        $this->allowedScriptDomains[] = $domain;
        return $this;
    }

    /**
     * Add allowed style domain
     *
     * @since 1.0.0
     * @param string $domain
     * @return self
     */
    public function addAllowedStyleDomain(string $domain): self
    {
        $this->allowedStyleDomains[] = $domain;
        return $this;
    }
}
