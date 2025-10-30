<?php
/**
 * Security Class
 *
 * Main orchestrator for theme security features
 * Delegates to specialized components for different security concerns
 *
 * @package BYSPress
 * @since 1.0.0
 */

namespace BYSPress;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

use BYSPress\Security\NonceManager;
use BYSPress\Security\HeaderSecurity;
use BYSPress\Security\PermissionsPolicy;
use BYSPress\Security\ContentSecurityPolicy;
use BYSPress\Security\WordPressSecurity;

class Security
{
    /**
     * Nonce manager component
     *
     * @var NonceManager
     */
    private NonceManager $nonceManager;

    /**
     * Header security component
     *
     * @var HeaderSecurity
     */
    private HeaderSecurity $headerSecurity;

    /**
     * Permissions policy component
     *
     * @var PermissionsPolicy
     */
    private PermissionsPolicy $permissionsPolicy;

    /**
     * Content security policy component
     *
     * @var ContentSecurityPolicy
     */
    private ContentSecurityPolicy $contentSecurityPolicy;

    /**
     * WordPress security component
     *
     * @var WordPressSecurity
     */
    private WordPressSecurity $wordPressSecurity;

    /**
     * Constructor
     *
     * @since 1.0.0
     */
    public function __construct()
    {
        // Initialize components
        $this->nonceManager = new NonceManager();
        $this->headerSecurity = new HeaderSecurity();
        $this->permissionsPolicy = new PermissionsPolicy();
        $this->contentSecurityPolicy = new ContentSecurityPolicy($this->nonceManager);
        $this->wordPressSecurity = new WordPressSecurity();
    }

    /**
     * Initialize all security features
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        // Always initialize nonce manager and WordPress security
        $this->nonceManager->init();
        $this->wordPressSecurity->init();

        // Only apply strict security headers in production
        if ($this->isProduction()) {
            $this->headerSecurity->init();
            $this->permissionsPolicy->init();
            $this->contentSecurityPolicy->init();
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
        return $this->nonceManager->getNonce();
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
        $this->contentSecurityPolicy->addAllowedScriptDomain($domain);
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
        $this->contentSecurityPolicy->addAllowedStyleDomain($domain);
        return $this;
    }

    /**
     * Check if we're in production environment
     *
     * @since 1.0.0
     * @return bool
     */
    public function isProduction(): bool
    {
        // Check if WP_ENVIRONMENT_TYPE is set to production
        if (function_exists('wp_get_environment_type')) {
            return wp_get_environment_type() === 'production';
        }

        // Fallback: Check if we're NOT on local domains
        $localDomains = ['localhost', '127.0.0.1', '.local', '.test', '.dev'];
        $host = $_SERVER['HTTP_HOST'] ?? '';

        foreach ($localDomains as $localDomain) {
            if (strpos($host, $localDomain) !== false) {
                return false;
            }
        }

        // If WP_DEBUG is enabled, assume not production
        if (defined('WP_DEBUG') && WP_DEBUG) {
            return false;
        }

        return true;
    }
}
