/**
 * MobileMenu Component Types
 *
 * Type definitions for the mobile menu sidebar component.
 *
 * @module components/MobileMenu
 */

/**
 * Menu item structure
 */
export interface MenuItem {
  /** Menu item title */
  title: string;
  /** Menu item URL */
  url: string;
  /** Whether this item is the current page */
  current?: boolean;
  /** Whether this item has an active child */
  has_active_child?: boolean;
  /** Child menu items */
  children?: MenuItem[];
}

/**
 * MobileMenu component props
 */
export interface MobileMenuProps {
  /** Whether the menu is currently open */
  isOpen?: boolean;
  /** Menu items to display */
  items?: MenuItem[];
}
