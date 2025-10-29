/**
 * Menu Navigation Composable
 *
 * Handles navigation with smooth menu close animation and URL validation.
 * Provides visual feedback by closing menu before page navigation.
 * Validates URLs for security before navigation.
 *
 * @module composables/useMobileMenu/useMenuNavigation
 */

import { validateMenuUrl } from '../../lib/security/urlValidator';

/**
 * Options for menu navigation
 */
export interface MenuNavigationOptions {
  /** Delay in ms before navigation (allows animation to complete) */
  navigationDelay?: number;
  /** Callback to close the menu */
  onNavigate?: () => void;
}

/**
 * Menu navigation composable
 *
 * Provides a handler for menu link clicks that smoothly closes
 * the menu before navigating to the target URL.
 * Validates URLs for security before allowing navigation.
 *
 * @param options - Configuration options
 * @returns Navigation handler
 *
 * @example
 * ```ts
 * const { handleNavigation } = useMenuNavigation({
 *   navigationDelay: 350,
 *   onNavigate: () => closeMenu(),
 * });
 *
 * // In template: @click="handleNavigation($event, item.url, item.title)"
 * ```
 */
export function useMenuNavigation(options: MenuNavigationOptions = {}) {
  const { navigationDelay = 350, onNavigate } = options;

  /**
   * Handle navigation with smooth menu close and security validation
   * Prevents default, validates URL, closes menu, waits for animation, then navigates
   *
   * @param event - Click event from the link
   * @param url - URL to navigate to
   * @param context - Optional context for logging (e.g., link title)
   */
  function handleNavigation(event: Event, url: string, context?: string): void {
    // Prevent default navigation
    event.preventDefault();

    // Validate URL for security (already validated in template, but defense-in-depth)
    const isValid = validateMenuUrl(url, context);

    if (!isValid) {
      // Silently fail for invalid URLs (already sanitized in template)
      if (import.meta.env.DEV) {
        console.error(`[Security] Blocked navigation to invalid URL: ${url}`);
      }
      return;
    }

    // Close the menu with animation
    onNavigate?.();

    // Wait for close animation to complete
    setTimeout(() => {
      // Navigate to the URL
      window.location.href = url;
    }, navigationDelay);
  }

  return {
    handleNavigation,
  };
}
