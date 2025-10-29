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

    // Check if click is outside dropdown and trigger
    const dropdown = document.querySelector(`[data-dropdown-id="${currentId}"]`);
    const trigger = document.querySelector(`[data-dropdown-trigger="${currentId}"]`);
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
      trigger.addEventListener('click', this.handleClick);
    });

    // Setup hover handlers for dropdown items
    const items = document.querySelectorAll('[data-dropdown-item]');
    items.forEach((item) => {
      const dropdownId = (item as HTMLElement).dataset.dropdownItem;
      if (dropdownId) {
        item.addEventListener('mouseenter', () => this.handleMouseEnter(dropdownId));
        item.addEventListener('mouseleave', () => this.handleMouseLeave(dropdownId));
      }
    });

    // Setup click outside handler
    document.addEventListener('click', this.handleClickOutside);
  }

  /**
   * Cleanup interaction handlers
   */
  destroy(): void {
    // Clean up click handlers
    const triggers = document.querySelectorAll('[data-dropdown-trigger]');
    triggers.forEach((trigger) => {
      trigger.removeEventListener('click', this.handleClick);
    });

    // Clean up hover handlers
    const items = document.querySelectorAll('[data-dropdown-item]');
    items.forEach((item) => {
      const dropdownId = (item as HTMLElement).dataset.dropdownItem;
      if (dropdownId) {
        item.removeEventListener('mouseenter', () => this.handleMouseEnter(dropdownId));
        item.removeEventListener('mouseleave', () => this.handleMouseLeave(dropdownId));
      }
    });

    // Clean up click outside
    document.removeEventListener('click', this.handleClickOutside);

    // Clear any pending timeout
    if (this.hoverTimeout) {
      window.clearTimeout(this.hoverTimeout);
    }
  }
}
