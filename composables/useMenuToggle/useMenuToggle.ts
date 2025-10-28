/**
 * MenuToggle Composable
 *
 * Reusable menu toggle logic for hamburger button.
 * Handles toggle state and custom event communication with MobileMenu.
 *
 * @module composables/useMenuToggle
 */

import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import type { MenuToggleOptions, MenuToggleReturn } from './useMenuToggle.types';

/**
 * MenuToggle composable
 *
 * Manages menu toggle state and communication between MenuToggle and MobileMenu components.
 * Uses custom DOM events for cross-component communication.
 *
 * @param options - MenuToggle configuration options
 * @returns Menu toggle state and methods
 *
 * @example
 * ```ts
 * const { isOpen, toggle } = useMenuToggle({
 *   initialOpen: false,
 *   onToggle: (open) => console.log('Menu is', open ? 'open' : 'closed')
 * });
 * ```
 */
export function useMenuToggle(options: MenuToggleOptions = {}): MenuToggleReturn {
  const { initialOpen = false, onToggle } = options;

  // Internal state
  const isOpen = ref<boolean>(initialOpen);

  /**
   * Toggle menu open/closed
   */
  function toggle(): void {
    isOpen.value = !isOpen.value;

    // Dispatch custom DOM event for MobileMenu to listen
    const event = new CustomEvent('mobile-menu-toggle', {
      detail: { isOpen: isOpen.value },
    });
    window.dispatchEvent(event);

    // Callback
    onToggle?.(isOpen.value);
  }

  /**
   * Open menu
   */
  function open(): void {
    if (!isOpen.value) {
      toggle();
    }
  }

  /**
   * Close menu
   */
  function close(): void {
    if (isOpen.value) {
      isOpen.value = false;
      onToggle?.(false);
    }
  }

  /**
   * Handle menu close event from MobileMenu
   */
  function handleMenuClose(): void {
    close();
  }

  // Lifecycle hooks
  onMounted(() => {
    window.addEventListener('mobile-menu-close', handleMenuClose);
  });

  onUnmounted(() => {
    window.removeEventListener('mobile-menu-close', handleMenuClose);
  });

  return {
    isOpen,
    toggle,
    open,
    close,
  };
}
