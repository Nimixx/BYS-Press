<?php
/**
 * Request Context Provider
 *
 * Provides current request information to Timber context
 * Includes current URL for menu active state detection
 *
 * @package CoreTheme\Context\Providers
 * @since 1.0.0
 */

namespace CoreTheme\Context\Providers;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

use CoreTheme\Context\ContextProviderInterface;

class RequestContextProvider implements ContextProviderInterface
{
    /**
     * Add request data to context
     *
     * @since 1.0.0
     * @param array $context Current context array
     * @return array Modified context array
     */
    public function addToContext(array $context): array
    {
        // Add current URL for menu active states
        $context['current_url'] = $_SERVER['REQUEST_URI'] ?? '/';

        return $context;
    }
}
