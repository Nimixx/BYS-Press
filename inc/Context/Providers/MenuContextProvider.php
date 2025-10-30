<?php
/**
 * Menu Context Provider
 *
 * Provides processed menu data to Timber context
 * Loads menu structure from inc/Config/menu.php and processes active states
 *
 * @package BYSPress\Context\Providers
 * @since 1.0.0
 */

namespace BYSPress\Context\Providers;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

use BYSPress\Context\ContextProviderInterface;
use BYSPress\Context\Processors\MenuProcessor;

class MenuContextProvider implements ContextProviderInterface
{
    /**
     * Theme directory path
     *
     * @var string
     */
    private string $themeDir;

    /**
     * Menu processor
     *
     * @var MenuProcessor
     */
    private MenuProcessor $processor;

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param string|null $themeDir Optional theme directory path
     */
    public function __construct(?string $themeDir = null)
    {
        $this->themeDir = $themeDir ?? get_template_directory();

        // Get current URL for menu processor (sanitized for XSS protection)
        $currentUrl = esc_url_raw($_SERVER['REQUEST_URI'] ?? '/');
        $this->processor = new MenuProcessor($currentUrl);
    }

    /**
     * Add processed menu to context
     *
     * @since 1.0.0
     * @param array $context Current context array
     * @return array Modified context array
     */
    public function addToContext(array $context): array
    {
        $menuConfigPath = $this->themeDir . '/inc/Config/menu.php';

        if (file_exists($menuConfigPath)) {
            $menuConfig = require $menuConfigPath;
            // Process menu with active states
            $context['menu_items'] = $this->processor->process($menuConfig);
        } else {
            $context['menu_items'] = [];
        }

        return $context;
    }
}
