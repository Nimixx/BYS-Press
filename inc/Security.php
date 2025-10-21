<?php
/**
 * Security Class
 *
 * Handles security headers and security-related configurations
 *
 * @package CoreTheme
 * @since 1.0.0
 */

namespace CoreTheme;

class Security
{
    /**
     * CSP nonce for inline scripts and styles
     *
     * @var string|null
     */
    private ?string $cspNonce = null;

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
     * Initialize security features
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        // Generate nonce early
        add_action('init', [$this, 'generateNonce'], 1);

        add_action('send_headers', [$this, 'sendSecurityHeaders']);
        add_filter('the_generator', '__return_empty_string');
        remove_action('wp_head', 'wp_generator');

        // Add nonce to inline scripts and styles
        add_filter('script_loader_tag', [$this, 'addNonceToScript'], 10, 2);
        add_filter('style_loader_tag', [$this, 'addNonceToStyle'], 10, 2);

        $this->configureRestApiSecurity();
        $this->disableFileEditing();
        $this->disableXmlRpc();
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

    /**
     * Send security headers
     *
     * @since 1.0.0
     * @return void
     */
    public function sendSecurityHeaders(): void
    {
        // Prevent headers from being sent twice
        if (headers_sent()) {
            return;
        }

        // Only apply strict security headers in production
        if (!$this->isProduction()) {
            return;
        }

        $this->sendBasicSecurityHeaders();
        $this->sendPermissionsPolicy();
        $this->sendContentSecurityPolicy();
        $this->sendHSTSHeader();
    }

    /**
     * Send basic security headers
     *
     * @since 1.0.0
     * @return void
     */
    private function sendBasicSecurityHeaders(): void
    {
        // X-Frame-Options: Prevents clickjacking attacks
        header('X-Frame-Options: SAMEORIGIN');

        // X-Content-Type-Options: Prevents MIME-sniffing attacks
        header('X-Content-Type-Options: nosniff');

        // X-XSS-Protection: Enables XSS filter in older browsers
        header('X-XSS-Protection: 1; mode=block');

        // Referrer-Policy: Controls referrer information sharing
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }

    /**
     * Send Permissions-Policy header
     *
     * @since 1.0.0
     * @return void
     */
    private function sendPermissionsPolicy(): void
    {
        $permissions = [
            'geolocation=()',
            'microphone=()',
            'camera=()',
            'payment=()',
            'usb=()',
            'magnetometer=()',
            'gyroscope=()',
            'accelerometer=()',
        ];

        $permissions = apply_filters('core_theme_permissions_policy', $permissions);
        header('Permissions-Policy: ' . implode(', ', $permissions));
    }

    /**
     * Send Content-Security-Policy header
     *
     * @since 1.0.0
     * @return void
     */
    private function sendContentSecurityPolicy(): void
    {
        $nonce = $this->getNonce();

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
            "script-src " . implode(' ', $scriptSrc),
            "style-src " . implode(' ', $styleSrc),
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "media-src 'self'",
            "object-src 'none'",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
        ];

        // Apply CSP filter to allow customization
        $cspDirectives = apply_filters('core_theme_csp_directives', $cspDirectives, $nonce);
        header('Content-Security-Policy: ' . implode('; ', $cspDirectives));
    }

    /**
     * Send Strict-Transport-Security header
     *
     * @since 1.0.0
     * @return void
     */
    private function sendHSTSHeader(): void
    {
        // Strict-Transport-Security: Forces HTTPS connections
        if (is_ssl()) {
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        }
    }

    /**
     * Configure REST API security
     *
     * @since 1.0.0
     * @return void
     */
    private function configureRestApiSecurity(): void
    {
        add_filter('rest_authentication_errors', function ($result) {
            if (!is_user_logged_in()) {
                // Hide user enumeration via REST API for non-logged-in users
                add_filter('rest_endpoints', function ($endpoints) {
                    if (isset($endpoints['/wp/v2/users'])) {
                        unset($endpoints['/wp/v2/users']);
                    }
                    if (isset($endpoints['/wp/v2/users/(?P<id>[\d]+)'])) {
                        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
                    }
                    return $endpoints;
                });
            }
            return $result;
        });
    }

    /**
     * Disable file editing in WordPress admin
     *
     * @since 1.0.0
     * @return void
     */
    private function disableFileEditing(): void
    {
        if (!defined('DISALLOW_FILE_EDIT')) {
            define('DISALLOW_FILE_EDIT', true);
        }
    }

    /**
     * Enable XML-RPC blocking (optional)
     *
     * @since 1.0.0
     * @return void
     */
    public function disableXmlRpc(): void
    {
        add_filter('xmlrpc_enabled', '__return_false');
    }
}
