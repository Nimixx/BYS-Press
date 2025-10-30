<?php
/**
 * Context Provider Interface
 *
 * Defines the contract for context providers that add data to Timber context.
 * Each provider is responsible for one specific aspect of the global context.
 *
 * @package BYSPress\Context
 * @since 1.0.0
 */

namespace BYSPress\Context;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

interface ContextProviderInterface
{
    /**
     * Add data to Timber context
     *
     * @since 1.0.0
     * @param array $context Current context array
     * @return array Modified context array
     */
    public function addToContext(array $context): array;
}
