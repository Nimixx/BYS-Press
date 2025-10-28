<?php
/**
 * WordPress Security
 *
 * Handles WordPress-specific security features:
 * - REST API security
 * - File editing restrictions
 * - XML-RPC blocking
 * - Version information hiding
 *
 * @package CoreTheme\Security
 * @since 1.0.0
 */

namespace CoreTheme\Security;

class WordPressSecurity
{
    /**
     * Initialize WordPress security features
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        $this->hideVersionInfo();
        $this->configureRestApiSecurity();
        $this->disableFileEditing();
        $this->disableXmlRpc();
    }

    /**
     * Hide WordPress version information
     *
     * @since 1.0.0
     * @return void
     */
    private function hideVersionInfo(): void
    {
        add_filter('the_generator', '__return_empty_string');
        remove_action('wp_head', 'wp_generator');
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
                    if (isset($endpoints['/wp/v2/users/(?P<id>[\\d]+)'])) {
                        unset($endpoints['/wp/v2/users/(?P<id>[\\d]+)']);
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
     * Disable XML-RPC
     *
     * @since 1.0.0
     * @return void
     */
    private function disableXmlRpc(): void
    {
        add_filter('xmlrpc_enabled', '__return_false');
    }
}
