/**
 * Menu Component
 *
 * Desktop navigation menu with accessible dropdowns.
 * Orchestrates dropdown state, keyboard navigation, and interactions.
 *
 * @module components/Menu
 */

import { DropdownState } from './dropdownState';
import { DropdownInteraction } from './dropdownInteraction';

/**
 * Menu instance
 */
class Menu {
  private state: DropdownState;
  private interaction: DropdownInteraction;

  constructor(private element: HTMLElement) {
    // Initialize modules
    this.state = new DropdownState();
    this.interaction = new DropdownInteraction(this.state);

    this.init();
  }

  /**
   * Initialize menu functionality
   */
  private init(): void {
    this.interaction.init();
  }

  /**
   * Cleanup and destroy menu
   */
  destroy(): void {
    this.interaction.destroy();
  }
}

/**
 * Initialize menu on DOM ready
 */
function initMenu(): Menu | null {
  const menuElement = document.querySelector('.menu') as HTMLElement;

  if (!menuElement) {
    return null;
  }

  return new Menu(menuElement);
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMenu);
} else {
  initMenu();
}

// Export for manual initialization if needed
export { Menu, initMenu };
