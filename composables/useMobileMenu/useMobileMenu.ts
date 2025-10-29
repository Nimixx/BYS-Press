/**
 * MobileMenu Composable
 *
 * Reusable mobile menu logic for sidebar navigation.
 * Handles menu state, body scroll locking, focus trap, and event communication with MenuToggle.
 *
 * @module composables/useMobileMenu
 */

import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import type { MobileMenuOptions, MobileMenuReturn } from './useMobileMenu.types';

/**
 * MobileMenu composable
 *
 * Manages mobile menu state, body scroll locking, focus trap for accessibility,
 * and communication with MenuToggle component.
 * Uses custom DOM events for cross-component communication.
 *
 * @param options - MobileMenu configuration options
 * @returns Mobile menu state, refs, and methods
 *
 * @example
 * ```ts
 * const { isOpen, menuRef, closeMenu } = useMobileMenu({
 *   initialOpen: false,
 *   lockBodyScroll: true,
 *   enableFocusTrap: true,
 *   onOpen: () => console.log('Menu opened'),
 *   onClose: () => console.log('Menu closed')
 * });
 * ```
 */
export function useMobileMenu(options: MobileMenuOptions = {}): MobileMenuReturn {
  const {
    initialOpen = false,
    lockBodyScroll = true,
    enableFocusTrap = true,
    onOpen,
    onClose,
  } = options;

  // Internal state
  const isOpen = ref<boolean>(initialOpen);

  // Menu element ref for focus trap
  const menuRef = ref<HTMLElement>();

  /**
   * Manage body scroll lock
   */
  function manageBodyScroll(lock: boolean): void {
    if (lockBodyScroll) {
      document.body.style.overflow = lock ? 'hidden' : '';
    }
  }

  /**
   * Setup focus trap for accessibility
   */
  let focusTrapActivate: (() => void) | null = null;
  let focusTrapDeactivate: (() => void) | null = null;

  if (enableFocusTrap) {
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
        closeMenu();
      },
    });

    focusTrapActivate = activate;
    focusTrapDeactivate = deactivate;
  }

  /**
   * Activate focus trap with smooth timing
   */
  async function activateFocusTrap(): Promise<void> {
    if (enableFocusTrap && focusTrapActivate) {
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
  function deactivateFocusTrap(): void {
    if (enableFocusTrap && focusTrapDeactivate) {
      focusTrapDeactivate();
    }
  }

  /**
   * Close menu
   */
  function closeMenu(): void {
    isOpen.value = false;
    manageBodyScroll(false);
    deactivateFocusTrap();

    // Dispatch close event for MenuToggle to listen
    const event = new CustomEvent('mobile-menu-close');
    window.dispatchEvent(event);

    // Callback
    onClose?.();
  }

  /**
   * Handle navigation with smooth menu close
   * Provides visual feedback by closing menu before page navigation
   *
   * @param event - Click event from the link
   * @param url - URL to navigate to
   */
  function handleNavigation(event: Event, url: string): void {
    // Prevent default navigation
    event.preventDefault();

    // Close the menu with animation
    closeMenu();

    // Wait for close animation to complete (300ms from CSS)
    // Add small buffer for smooth UX
    setTimeout(() => {
      // Navigate to the URL
      window.location.href = url;
    }, 350);
  }

  /**
   * Handle toggle event from MenuToggle
   */
  function handleToggle(event: Event): void {
    const customEvent = event as CustomEvent<{ isOpen: boolean }>;
    const newState = customEvent.detail.isOpen;

    isOpen.value = newState;
    manageBodyScroll(newState);

    // Handle focus trap
    if (newState) {
      void activateFocusTrap();
    } else {
      deactivateFocusTrap();
    }

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

    // Handle focus trap activation/deactivation
    if (newValue) {
      void activateFocusTrap();
    } else {
      deactivateFocusTrap();
    }
  });

  // Lifecycle hooks
  onMounted(() => {
    window.addEventListener('mobile-menu-toggle', handleToggle);
  });

  onUnmounted(() => {
    window.removeEventListener('mobile-menu-toggle', handleToggle);
    // Clean up body scroll on unmount
    manageBodyScroll(false);
    // Clean up focus trap on unmount
    deactivateFocusTrap();
  });

  return {
    isOpen,
    menuRef,
    closeMenu,
    handleNavigation,
  };
}
