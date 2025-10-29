/**
 * MobileMenu Composable
 *
 * Orchestrates mobile menu functionality by composing smaller, focused composables.
 * Handles menu state and event communication with MenuToggle.
 *
 * @module composables/useMobileMenu
 */

import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useBodyScrollLock } from './useBodyScrollLock';
import { useMenuFocusTrap } from './useMenuFocusTrap';
import { useMenuNavigation } from './useMenuNavigation';
import type { MobileMenuOptions, MobileMenuReturn } from './useMobileMenu.types';

/**
 * MobileMenu composable
 *
 * Orchestrates mobile menu state, body scroll locking, focus trap, navigation,
 * and communication with MenuToggle component.
 * Composes smaller, focused composables for clean separation of concerns.
 *
 * @param options - MobileMenu configuration options
 * @returns Mobile menu state, refs, and methods
 *
 * @example
 * ```ts
 * const { isOpen, menuRef, closeMenu, handleNavigation } = useMobileMenu({
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

  // Menu state
  const isOpen = ref<boolean>(initialOpen);
  const menuRef = ref<HTMLElement>();

  // Compose sub-composables for specific functionality
  const { lockScroll, unlockScroll } = useBodyScrollLock({ enabled: lockBodyScroll });

  const focusTrap = useMenuFocusTrap(menuRef, {
    enabled: enableFocusTrap,
    onEscapeDeactivate: () => closeMenu(),
  });

  /**
   * Close menu and clean up
   */
  function closeMenu(): void {
    isOpen.value = false;
    unlockScroll();
    focusTrap.deactivate();

    // Dispatch close event for MenuToggle to listen
    const event = new CustomEvent('mobile-menu-close');
    window.dispatchEvent(event);

    // Callback
    onClose?.();
  }

  // Setup navigation handler
  const { handleNavigation } = useMenuNavigation({
    navigationDelay: 350,
    onNavigate: () => closeMenu(),
  });

  /**
   * Handle toggle event from MenuToggle
   */
  function handleToggle(event: Event): void {
    const customEvent = event as CustomEvent<{ isOpen: boolean }>;
    const newState = customEvent.detail.isOpen;

    isOpen.value = newState;

    // Handle side effects based on state
    if (newState) {
      lockScroll();
      void focusTrap.activate();
      onOpen?.();
    } else {
      unlockScroll();
      focusTrap.deactivate();
      onClose?.();
    }
  }

  /**
   * Watch for state changes (if parent controls state via props)
   */
  watch(isOpen, (newValue) => {
    // Sync body scroll and focus trap with state
    if (newValue) {
      lockScroll();
      void focusTrap.activate();
    } else {
      unlockScroll();
      focusTrap.deactivate();
    }
  });

  // Lifecycle hooks
  onMounted(() => {
    window.addEventListener('mobile-menu-toggle', handleToggle);
  });

  onUnmounted(() => {
    window.removeEventListener('mobile-menu-toggle', handleToggle);
    // Sub-composables handle their own cleanup via onUnmounted
  });

  return {
    isOpen,
    menuRef,
    closeMenu,
    handleNavigation,
  };
}
