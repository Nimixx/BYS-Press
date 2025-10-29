/**
 * Dropdown Interaction Module
 *
 * Handles click, hover, and click-outside interactions for dropdowns.
 * Provides unified interface for both interaction types.
 *
 * @module components/Menu/dropdownInteraction
 */

import type { DropdownState } from './dropdownState';

/**
 * Dropdown interaction handler
 */
export class DropdownInteraction {
  private hoverTimeout: number | null = null;
  private mouseEnterHandlers = new Map<string, () => void>();
  private mouseLeaveHandlers = new Map<string, () => void>();

  constructor(private state: DropdownState) {
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  /**
   * Handle click on dropdown trigger
   */
  private handleClick(event: Event): void {
    const trigger = event.currentTarget as HTMLElement;
    const dropdownId = trigger.dataset.dropdownTrigger;

    if (dropdownId) {
      event.preventDefault();
      event.stopPropagation();
      this.state.toggle(dropdownId);
    }
  }

  /**
   * Handle mouse enter on dropdown item
   */
  private handleMouseEnter(dropdownId: string): void {
    // Clear any pending hover timeout
    if (this.hoverTimeout) {
      window.clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    this.state.open(dropdownId);
  }

  /**
   * Handle mouse leave on dropdown item
   */
  private handleMouseLeave(dropdownId: string): void {
    // Delay closing to allow moving to submenu
    this.hoverTimeout = window.setTimeout(() => {
      this.state.close(dropdownId);
    }, 150);
  }

  /**
   * Handle click outside to close dropdowns
   */
  private handleClickOutside(event: MouseEvent): void {
    const currentId = this.state.getCurrent();
    if (!currentId) return;

    const target = event.target as HTMLElement;

    // Check if click is outside dropdown item
    const item = document.querySelector(`[data-dropdown-item="${currentId}"]`);

    const isOutside = item && !item.contains(target);

    if (isOutside) {
      this.state.closeAll();
    }
  }

  /**
   * Initialize interaction handlers
   */
  init(): void {
    // Setup click handlers for triggers
    const triggers = document.querySelectorAll('[data-dropdown-trigger]');
    triggers.forEach((trigger) => {
      // Method is bound in constructor
      // eslint-disable-next-line @typescript-eslint/unbound-method
      trigger.addEventListener('click', this.handleClick);
    });

    // Setup hover handlers for dropdown items
    const items = document.querySelectorAll('[data-dropdown-item]');
    items.forEach((item) => {
      const dropdownId = (item as HTMLElement).dataset.dropdownItem;
      if (dropdownId) {
        const enterHandler = (): void => this.handleMouseEnter(dropdownId);
        const leaveHandler = (): void => this.handleMouseLeave(dropdownId);

        this.mouseEnterHandlers.set(dropdownId, enterHandler);
        this.mouseLeaveHandlers.set(dropdownId, leaveHandler);

        item.addEventListener('mouseenter', enterHandler);
        item.addEventListener('mouseleave', leaveHandler);
      }
    });

    // Setup click outside handler - method is bound in constructor
    // eslint-disable-next-line @typescript-eslint/unbound-method
    document.addEventListener('click', this.handleClickOutside);
  }

  /**
   * Cleanup interaction handlers
   */
  destroy(): void {
    // Clean up click handlers
    const triggers = document.querySelectorAll('[data-dropdown-trigger]');
    triggers.forEach((trigger) => {
      // Method is bound in constructor
      // eslint-disable-next-line @typescript-eslint/unbound-method
      trigger.removeEventListener('click', this.handleClick);
    });

    // Clean up hover handlers
    const items = document.querySelectorAll('[data-dropdown-item]');
    items.forEach((item) => {
      const dropdownId = (item as HTMLElement).dataset.dropdownItem;
      if (dropdownId) {
        const enterHandler = this.mouseEnterHandlers.get(dropdownId);
        const leaveHandler = this.mouseLeaveHandlers.get(dropdownId);

        if (enterHandler) {
          item.removeEventListener('mouseenter', enterHandler);
        }
        if (leaveHandler) {
          item.removeEventListener('mouseleave', leaveHandler);
        }
      }
    });

    // Clean up click outside - method is bound in constructor
    // eslint-disable-next-line @typescript-eslint/unbound-method
    document.removeEventListener('click', this.handleClickOutside);

    // Clear handler maps
    this.mouseEnterHandlers.clear();
    this.mouseLeaveHandlers.clear();

    // Clear any pending timeout
    if (this.hoverTimeout) {
      window.clearTimeout(this.hoverTimeout);
    }
  }
}
