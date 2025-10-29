/**
 * Header Height Composable
 *
 * Calculates and maintains the actual header height as a CSS variable
 * Useful for positioning elements relative to a dynamic-height header
 *
 * @module composables/useHeaderHeight
 */

import { onMounted, onUnmounted } from 'vue';

/**
 * Updates the header height CSS variable based on actual header element height
 */
export function useHeaderHeight(): void {
  let resizeObserver: ResizeObserver | null = null;

  /**
   * Update CSS variable with current header height
   */
  const updateHeaderHeight = (): void => {
    const header = document.querySelector('.site-header') as HTMLElement;
    if (!header) return;

    const height = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height-actual', `${height}px`);
  };

  onMounted(() => {
    // Initial calculation
    updateHeaderHeight();

    // Watch for header size changes using ResizeObserver
    const header = document.querySelector('.site-header');
    if (header && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        updateHeaderHeight();
      });
      resizeObserver.observe(header);
    }

    // Fallback: Listen for window resize
    window.addEventListener('resize', updateHeaderHeight);
  });

  onUnmounted(() => {
    // Clean up
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    window.removeEventListener('resize', updateHeaderHeight);
  });
}
