/**
 * Body Scroll Lock Composable
 *
 * Manages body scroll locking/unlocking for modal-like components.
 * Prevents background scrolling when mobile menu is open.
 *
 * @module composables/useMobileMenu/useBodyScrollLock
 */

import { onUnmounted } from 'vue';

/**
 * Options for body scroll lock
 */
export interface BodyScrollLockOptions {
  /** Whether to enable body scroll locking */
  enabled?: boolean;
}

/**
 * Body scroll lock composable
 *
 * Provides methods to lock/unlock body scrolling.
 * Automatically cleans up on component unmount.
 *
 * @param options - Configuration options
 * @returns Methods to manage body scroll
 *
 * @example
 * ```ts
 * const { lockScroll, unlockScroll } = useBodyScrollLock({ enabled: true });
 *
 * // Lock scrolling
 * lockScroll();
 *
 * // Unlock scrolling
 * unlockScroll();
 * ```
 */
export function useBodyScrollLock(options: BodyScrollLockOptions = {}) {
  const { enabled = true } = options;

  /**
   * Lock body scroll
   */
  function lockScroll(): void {
    if (enabled) {
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Unlock body scroll
   */
  function unlockScroll(): void {
    if (enabled) {
      document.body.style.overflow = '';
    }
  }

  // Clean up on unmount
  onUnmounted(() => {
    unlockScroll();
  });

  return {
    lockScroll,
    unlockScroll,
  };
}
