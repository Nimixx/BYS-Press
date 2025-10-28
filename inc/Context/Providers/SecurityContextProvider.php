<?php
/**
 * Security Context Provider
 *
 * Provides security-related data to Timber context
 * Includes CSP nonce for inline scripts/styles
 *
 * @package CoreTheme\Context\Providers
 * @since 1.0.0
 */

namespace CoreTheme\Context\Providers;

use CoreTheme\Context\ContextProviderInterface;
use CoreTheme\Security;

class SecurityContextProvider implements ContextProviderInterface
{
    /**
     * Security instance
     *
     * @var Security
     */
    private Security $security;

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param Security $security Security instance
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * Add security data to context
     *
     * @since 1.0.0
     * @param array $context Current context array
     * @return array Modified context array
     */
    public function addToContext(array $context): array
    {
        // Add CSP nonce to context for inline scripts/styles in templates
        $context['csp_nonce'] = $this->security->getNonce();

        return $context;
    }
}
