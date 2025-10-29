/**
 * Menu Navigation Composable
 *
 * Handles navigation with smooth menu close animation.
 * Provides visual feedback by closing menu before page navigation.
 *
 * @module composables/useMobileMenu/useMenuNavigation
 */

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
 * // In template: @click="handleNavigation($event, item.url)"
 * ```
 */
export function useMenuNavigation(options: MenuNavigationOptions = {}) {
  const { navigationDelay = 350, onNavigate } = options;

  /**
   * Handle navigation with smooth menu close
   * Prevents default, closes menu, waits for animation, then navigates
   *
   * @param event - Click event from the link
   * @param url - URL to navigate to
   */
  function handleNavigation(event: Event, url: string): void {
    // Prevent default navigation
    event.preventDefault();

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
