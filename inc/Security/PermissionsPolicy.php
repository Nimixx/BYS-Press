<?php
/**
 * Permissions Policy
 *
 * Manages Permissions-Policy header for controlling browser features
 *
 * @package CoreTheme\Security
 * @since 1.0.0
 */

namespace CoreTheme\Security;

class PermissionsPolicy
{
    /**
     * Initialize permissions policy
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        add_action('send_headers', [$this, 'sendPermissionsPolicy']);
    }

    /**
     * Send Permissions-Policy header
     *
     * @since 1.0.0
     * @return void
     */
    public function sendPermissionsPolicy(): void
    {
        // Prevent headers from being sent twice
        if (headers_sent()) {
            return;
        }

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
}
