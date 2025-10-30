<?php
/**
 * Header Security
 *
 * Handles basic security headers (X-Frame-Options, X-Content-Type-Options, etc.)
 * and HSTS (Strict-Transport-Security)
 *
 * @package BYSPress\Security
 * @since 1.0.0
 */

namespace BYSPress\Security;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

class HeaderSecurity
{
    /**
     * Initialize security headers
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        add_action('send_headers', [$this, 'sendSecurityHeaders']);
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

        $this->sendBasicSecurityHeaders();
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
}
