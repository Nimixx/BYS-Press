<?php
/**
 * Menu Processor
 *
 * Processes menu configuration and adds active states based on current URL
 * Handles all menu logic server-side to keep templates clean
 *
 * @package CoreTheme\Context\Processors
 * @since 1.0.0
 */

namespace CoreTheme\Context\Processors;

class MenuProcessor
{
    /**
     * Current request URL
     *
     * @var string
     */
    private string $currentUrl;

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param string $currentUrl Current request URL
     */
    public function __construct(string $currentUrl)
    {
        $this->currentUrl = $currentUrl;
    }

    /**
     * Process menu configuration
     *
     * @since 1.0.0
     * @param array $menuConfig Raw menu configuration
     * @return array Processed menu items with active states
     */
    public function process(array $menuConfig): array
    {
        $processedMenu = [];

        foreach ($menuConfig as $item) {
            $processedMenu[] = $this->processMenuItem($item);
        }

        return $processedMenu;
    }

    /**
     * Process a single menu item
     *
     * @since 1.0.0
     * @param array $item Menu item data
     * @return array Processed menu item
     */
    private function processMenuItem(array $item): array
    {
        $itemActive = $this->isActive($item['url']);
        $hasActiveChild = false;
        $processedChildren = null;

        // Process children if they exist
        if (isset($item['children']) && is_array($item['children'])) {
            $processedChildren = [];

            foreach ($item['children'] as $child) {
                $childActive = $this->isActive($child['url']);

                if ($childActive) {
                    $hasActiveChild = true;
                }

                $processedChildren[] = [
                    'title' => $child['title'],
                    'url' => $child['url'],
                    'current' => $childActive,
                ];
            }
        }

        return [
            'title' => $item['title'],
            'url' => $item['url'],
            'current' => $itemActive,
            'has_active_child' => $hasActiveChild,
            'children' => $processedChildren,
        ];
    }

    /**
     * Check if a URL is active based on current request
     *
     * @since 1.0.0
     * @param string $url URL to check
     * @return bool True if URL is active
     */
    private function isActive(string $url): bool
    {
        // Exact match
        if ($this->currentUrl === $url) {
            return true;
        }

        // Starts with match (but not for homepage)
        if ($url !== '/' && strpos($this->currentUrl, $url) === 0) {
            return true;
        }

        return false;
    }
}
