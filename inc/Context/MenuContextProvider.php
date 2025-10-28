<?php
/**
 * Menu Context Provider
 *
 * Provides menu configuration data to Timber context
 * Loads menu structure from inc/Config/menu.php
 *
 * @package CoreTheme\Context
 * @since 1.0.0
 */

namespace CoreTheme\Context;

class MenuContextProvider implements ContextProviderInterface
{
    /**
     * Theme directory path
     *
     * @var string
     */
    private string $themeDir;

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param string|null $themeDir Optional theme directory path
     */
    public function __construct(?string $themeDir = null)
    {
        $this->themeDir = $themeDir ?? get_template_directory();
    }

    /**
     * Add menu configuration to context
     *
     * @since 1.0.0
     * @param array $context Current context array
     * @return array Modified context array
     */
    public function addToContext(array $context): array
    {
        $menuConfigPath = $this->themeDir . '/inc/Config/menu.php';

        if (file_exists($menuConfigPath)) {
            $context['menu_config'] = require $menuConfigPath;
        } else {
            $context['menu_config'] = [];
        }

        return $context;
    }
}
