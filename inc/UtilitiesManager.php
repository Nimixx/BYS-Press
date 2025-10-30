<?php
/**
 * Utilities Manager
 *
 * Manages and auto-loads utility files from the utilities directory
 *
 * @package BYSPress
 * @since 1.0.0
 */

namespace BYSPress;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit();
}

class UtilitiesManager
{
    /**
     * Path to utilities directory
     *
     * @var string
     */
    private string $utilitiesPath;

    /**
     * Loaded utilities tracking
     *
     * @var array
     */
    private array $loadedUtilities = [];

    /**
     * Constructor
     *
     * @since 1.0.0
     * @param string|null $utilitiesPath Custom path to utilities directory
     */
    public function __construct(?string $utilitiesPath = null)
    {
        $this->utilitiesPath = $utilitiesPath ?? get_template_directory() . '/inc/utilities';
    }

    /**
     * Initialize utilities manager
     *
     * Auto-loads all PHP files from the utilities directory
     *
     * @since 1.0.0
     * @return void
     */
    public function init(): void
    {
        // Check if utilities directory exists
        if (!is_dir($this->utilitiesPath)) {
            return;
        }

        // Load all PHP files from utilities directory
        $this->loadUtilities();

        do_action('bys_press_utilities_loaded', $this->loadedUtilities);
    }

    /**
     * Load all utility files
     *
     * Scans the utilities directory and includes all PHP files
     *
     * @since 1.0.0
     * @return void
     */
    private function loadUtilities(): void
    {
        $files = glob($this->utilitiesPath . '/*.php');

        if (!$files) {
            return;
        }

        foreach ($files as $file) {
            $this->loadUtility($file);
        }
    }

    /**
     * Load a single utility file
     *
     * @since 1.0.0
     * @param string $file Path to the utility file
     * @return void
     */
    private function loadUtility(string $file): void
    {
        if (!file_exists($file)) {
            return;
        }

        require_once $file;

        $utilityName = basename($file, '.php');
        $this->loadedUtilities[] = $utilityName;

        do_action('bys_press_utility_loaded', $utilityName, $file);
    }

    /**
     * Get list of loaded utilities
     *
     * @since 1.0.0
     * @return array
     */
    public function getLoadedUtilities(): array
    {
        return $this->loadedUtilities;
    }

    /**
     * Get utilities directory path
     *
     * @since 1.0.0
     * @return string
     */
    public function getUtilitiesPath(): string
    {
        return $this->utilitiesPath;
    }
}
