/**
 * Responsive Close Composable
 *
 * Detects viewport changes and automatically closes mobile menu
 * when switching from mobile to desktop view.
 *
 * @module composables/useMobileMenu/useResponsiveClose
 */

import { onMounted, onUnmounted } from 'vue';

/**
 * Options for responsive close
 */
export interface ResponsiveCloseOptions {
  /** Breakpoint in pixels (default: 769) */
  breakpoint?: number;
  /** Callback to close the menu */
  onDesktopView?: () => void;
}

/**
 * Responsive close composable
 *
 * Monitors viewport size and automatically closes menu
 * when transitioning to desktop view.
 *
 * @param options - Configuration options
 *
 * @example
 * ```ts
 * useResponsiveClose({
 *   breakpoint: 769,
 *   onDesktopView: () => closeMenu(),
 * });
 * ```
 */
export function useResponsiveClose(options: ResponsiveCloseOptions = {}) {
  const { breakpoint = 769, onDesktopView } = options;

  // Create media query for desktop breakpoint
  const mediaQuery = `(min-width: ${breakpoint}px)`;
  let mediaQueryList: MediaQueryList | undefined;

  /**
   * Handle viewport change
   * Closes menu when switching to desktop view
   */
  function handleViewportChange(event: MediaQueryListEvent): void {
    // If matches desktop breakpoint, close the menu
    if (event.matches) {
      onDesktopView?.();
    }
  }

  /**
   * Check if currently on desktop view
   */
  function checkDesktopView(mql: MediaQueryList): void {
    if (mql.matches) {
      onDesktopView?.();
    }
  }

  onMounted(() => {
    // Create media query list
    mediaQueryList = window.matchMedia(mediaQuery);

    // Check initial state - if already on desktop, ensure menu is closed
    checkDesktopView(mediaQueryList);

    // Listen for viewport changes using modern API
    mediaQueryList.addEventListener('change', handleViewportChange);
  });

  onUnmounted(() => {
    // Clean up listener
    if (mediaQueryList) {
      mediaQueryList.removeEventListener('change', handleViewportChange);
    }
  });

  return {
    // Could expose methods here if needed
  };
}
