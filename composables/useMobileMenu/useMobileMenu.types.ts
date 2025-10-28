/**
 * MobileMenu Composable Types
 *
 * Type definitions for the useMobileMenu composable.
 *
 * @module composables/useMobileMenu
 */

import type { Ref } from 'vue';

/**
 * MobileMenu configuration options
 */
export interface MobileMenuOptions {
  /** Initial open state */
  initialOpen?: boolean;
  /** Enable body scroll lock when open */
  lockBodyScroll?: boolean;
  /** Callback when menu is opened */
  onOpen?: () => void;
  /** Callback when menu is closed */
  onClose?: () => void;
}

/**
 * MobileMenu composable return type
 */
export interface MobileMenuReturn {
  /** Whether menu is currently open */
  isOpen: Ref<boolean>;
  /** Close menu */
  closeMenu: () => void;
}
