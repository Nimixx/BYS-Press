/**
 * MobileMenu Composable
 *
 * Reusable mobile menu logic for sidebar navigation.
 * Handles menu state, body scroll locking, and event communication with MenuToggle.
 *
 * @module composables/useMobileMenu
 */

import { ref, watch, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import type { MobileMenuOptions, MobileMenuReturn } from './useMobileMenu.types';

/**
 * MobileMenu composable
 *
 * Manages mobile menu state, body scroll locking, and communication with MenuToggle component.
 * Uses custom DOM events for cross-component communication.
 *
 * @param options - MobileMenu configuration options
 * @returns Mobile menu state and methods
 *
 * @example
 * ```ts
 * const { isOpen, closeMenu } = useMobileMenu({
 *   initialOpen: false,
 *   lockBodyScroll: true,
 *   onOpen: () => console.log('Menu opened'),
 *   onClose: () => console.log('Menu closed')
 * });
 * ```
 */
export function useMobileMenu(options: MobileMenuOptions = {}): MobileMenuReturn {
  const { initialOpen = false, lockBodyScroll = true, onOpen, onClose } = options;

  // Internal state
  const isOpen = ref<boolean>(initialOpen);

  /**
   * Manage body scroll lock
   */
  function manageBodyScroll(lock: boolean): void {
    if (lockBodyScroll) {
      document.body.style.overflow = lock ? 'hidden' : '';
    }
  }

  /**
   * Close menu
   */
  function closeMenu(): void {
    isOpen.value = false;
    manageBodyScroll(false);

    // Dispatch close event for MenuToggle to listen
    const event = new CustomEvent('mobile-menu-close');
    window.dispatchEvent(event);

    // Callback
    onClose?.();
  }

  /**
   * Handle toggle event from MenuToggle
   */
  function handleToggle(event: Event): void {
    const customEvent = event as CustomEvent<{ isOpen: boolean }>;
    const newState = customEvent.detail.isOpen;

    isOpen.value = newState;
    manageBodyScroll(newState);

    // Callbacks
    if (newState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }

  /**
   * Watch for state changes (if parent controls state via props)
   */
  watch(isOpen, (newValue) => {
    manageBodyScroll(newValue);
  });

  // Lifecycle hooks
  onMounted(() => {
    window.addEventListener('mobile-menu-toggle', handleToggle);
  });

  onUnmounted(() => {
    window.removeEventListener('mobile-menu-toggle', handleToggle);
    // Clean up body scroll on unmount
    manageBodyScroll(false);
  });

  return {
    isOpen,
    closeMenu,
  };
}
