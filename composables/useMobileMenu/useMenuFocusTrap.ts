/**
 * Menu Focus Trap Composable
 *
 * Manages focus trapping for accessible menu navigation.
 * Traps keyboard focus within the menu when open.
 *
 * @module composables/useMobileMenu/useMenuFocusTrap
 */

import { ref, nextTick, onUnmounted } from 'vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import type { Ref } from 'vue';

/**
 * Options for menu focus trap
 */
export interface MenuFocusTrapOptions {
  /** Whether to enable focus trap */
  enabled?: boolean;
  /** Callback when ESC key closes the menu */
  onEscapeDeactivate?: () => void;
}

/**
 * Menu focus trap composable
 *
 * Sets up and manages focus trap for menu accessibility.
 * Provides methods to activate/deactivate the trap with proper timing.
 *
 * @param menuRef - Reference to the menu element
 * @param options - Configuration options
 * @returns Methods to manage focus trap
 *
 * @example
 * ```ts
 * const menuRef = ref<HTMLElement>();
 * const { activate, deactivate } = useMenuFocusTrap(menuRef, {
 *   enabled: true,
 *   onEscapeDeactivate: () => closeMenu(),
 * });
 *
 * // Activate focus trap when menu opens
 * await activate();
 *
 * // Deactivate when menu closes
 * deactivate();
 * ```
 */
export function useMenuFocusTrap(
  menuRef: Ref<HTMLElement | undefined>,
  options: MenuFocusTrapOptions = {},
) {
  const { enabled = true, onEscapeDeactivate } = options;

  let focusTrapActivate: (() => void) | null = null;
  let focusTrapDeactivate: (() => void) | null = null;

  // Setup focus trap if enabled
  if (enabled) {
    const { activate, deactivate } = useFocusTrap(menuRef, {
      // Allow ESC key to close the menu
      escapeDeactivates: true,
      // Allow clicking outside to close (handled by overlay)
      allowOutsideClick: true,
      // Return focus to the toggle button when closing
      returnFocusOnDeactivate: true,
      // Focus the first link when menu opens
      initialFocus: () => menuRef.value?.querySelector('.mobile-menu__link') as HTMLElement,
      // Fallback focus to menu container if no links found
      fallbackFocus: () => menuRef.value as HTMLElement,
      // Handle ESC key to close menu
      onDeactivate: () => {
        onEscapeDeactivate?.();
      },
    });

    focusTrapActivate = activate;
    focusTrapDeactivate = deactivate;
  }

  /**
   * Activate focus trap with smooth timing
   * Waits for DOM to be ready and adds small delay for smooth UX
   */
  async function activateTrap(): Promise<void> {
    if (enabled && focusTrapActivate) {
      // Wait for the element to be rendered with v-if
      await nextTick();
      // Small delay to ensure transition starts smoothly
      setTimeout(() => {
        focusTrapActivate?.();
      }, 50);
    }
  }

  /**
   * Deactivate focus trap
   */
  function deactivateTrap(): void {
    if (enabled && focusTrapDeactivate) {
      focusTrapDeactivate();
    }
  }

  // Clean up on unmount
  onUnmounted(() => {
    deactivateTrap();
  });

  return {
    activate: activateTrap,
    deactivate: deactivateTrap,
  };
}
