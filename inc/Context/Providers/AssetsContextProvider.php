<?php
/**
 * Assets Context Provider
 *
 * Provides static asset paths to Timber context
 * Loads asset configuration from inc/Config/assets.php
 *
 * @package CoreTheme\Context\Providers
 * @since 1.0.0
 */

namespace CoreTheme\Context\Providers;

use CoreTheme\Context\ContextProviderInterface;

class AssetsContextProvider implements ContextProviderInterface
{
    /**
     * Theme directory path
     *
     * @var string
     */
    private string $themeDir;

    /**
     * Theme URI
     *
     * @var string
     */
    private string $themeUri;

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param string|null $themeDir Optional theme directory path
     * @param string|null $themeUri Optional theme URI
     */
    public function __construct(?string $themeDir = null, ?string $themeUri = null)
    {
        $this->themeDir = $themeDir ?? get_template_directory();
        $this->themeUri = $themeUri ?? get_template_directory_uri();
    }

    /**
     * Add assets configuration to context
     *
     * @since 1.0.0
     * @param array $context Current context array
     * @return array Modified context array
     */
    public function addToContext(array $context): array
    {
        $assetsConfigPath = $this->themeDir . '/inc/Config/assets.php';

        if (file_exists($assetsConfigPath)) {
            $assetsConfig = require $assetsConfigPath;

            // Process logo path to full URL
            if (isset($assetsConfig['logo'])) {
                $context['logo'] = [
                    'url' => $this->themeUri . $assetsConfig['logo']['path'],
                    'alt' => $assetsConfig['logo']['alt'] ?? get_bloginfo('name'),
                ];
            }

            // Add topbar configuration if enabled
            if (
                isset($assetsConfig['topbar']) &&
                !empty($assetsConfig['topbar']['enabled'])
            ) {
                $context['topbar_phone'] = $assetsConfig['topbar']['phone'] ?? null;
                $context['topbar_email'] = $assetsConfig['topbar']['email'] ?? null;
                $context['topbar_message'] = $assetsConfig['topbar']['message'] ?? null;
                $context['topbar_social_links'] =
                    $assetsConfig['topbar']['social_links'] ?? null;
            }

            // Store raw config for other uses
            $context['assets_config'] = $assetsConfig;
        } else {
            $context['logo'] = null;
            $context['assets_config'] = [];
        }

        return $context;
    }
}
