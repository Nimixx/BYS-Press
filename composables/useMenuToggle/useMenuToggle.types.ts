/**
 * MenuToggle Composable Types
 *
 * Type definitions for the useMenuToggle composable.
 *
 * @module composables/useMenuToggle
 */

import type { Ref } from 'vue';

/**
 * MenuToggle configuration options
 */
export interface MenuToggleOptions {
  /** Initial open state */
  initialOpen?: boolean;
  /** Callback when menu is toggled */
  onToggle?: (isOpen: boolean) => void;
}

/**
 * MenuToggle composable return type
 */
export interface MenuToggleReturn {
  /** Whether menu is currently open */
  isOpen: Ref<boolean>;
  /** Toggle menu open/closed */
  toggle: () => void;
  /** Open menu */
  open: () => void;
  /** Close menu */
  close: () => void;
}
