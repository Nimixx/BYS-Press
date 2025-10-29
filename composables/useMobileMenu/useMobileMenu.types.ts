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
  /** Enable focus trap for accessibility (default: true) */
  enableFocusTrap?: boolean;
  /** Enable auto-close on desktop view (default: true) */
  enableResponsiveClose?: boolean;
  /** Desktop breakpoint in pixels (default: 769) */
  desktopBreakpoint?: number;
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
  /** Reference to the menu element (for focus trap) */
  menuRef: Ref<HTMLElement | undefined>;
  /** Close menu */
  closeMenu: () => void;
  /** Handle navigation link click with smooth menu close and URL validation */
  handleNavigation: (event: Event, url: string, context?: string) => void;
}
