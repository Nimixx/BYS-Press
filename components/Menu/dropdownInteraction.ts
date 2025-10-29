/**
 * Dropdown Interaction Module
 *
 * Handles click, hover, and click-outside interactions for dropdowns.
 * Uses event delegation for optimal performance.
 *
 * @module components/Menu/dropdownInteraction
 */

import type { DropdownState } from './dropdownState';

/**
 * Dropdown interaction handler with event delegation
 */
export class DropdownInteraction {
  private hoverTimeout: number | null = null;
  private menuElement: HTMLElement | null = null;
  private currentHoveredItem: string | null = null;

  constructor(private state: DropdownState) {
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
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
   * Find dropdown item from event target
   * Traverses up the DOM tree to find [data-dropdown-item]
   */
  private findDropdownItem(target: EventTarget | null): HTMLElement | null {
    if (!target || !(target instanceof HTMLElement)) return null;

    // Check if target itself is a dropdown item
    if (target.dataset.dropdownItem) {
      return target;
    }

    // Traverse up to find dropdown item (but stop at menu container)
    let element = target.parentElement;
    while (element && element !== this.menuElement) {
      if (element.dataset.dropdownItem) {
        return element;
      }
      element = element.parentElement;
    }

    return null;
  }

  /**
   * Handle mouse over with event delegation
   * Uses mouseover (bubbles) instead of mouseenter (doesn't bubble)
   */
  private handleMouseOver(event: MouseEvent): void {
    const dropdownItem = this.findDropdownItem(event.target);
    const dropdownId = dropdownItem?.dataset.dropdownItem;

    // If we're hovering over a dropdown item
    if (dropdownId) {
      // Only process if it's a different item than currently hovered
      if (dropdownId !== this.currentHoveredItem) {
        // Clear any pending close timeout
        if (this.hoverTimeout) {
          window.clearTimeout(this.hoverTimeout);
          this.hoverTimeout = null;
        }

        this.currentHoveredItem = dropdownId;
        this.state.open(dropdownId);
      }
    }
  }

  /**
   * Handle mouse out with event delegation
   * Uses mouseout (bubbles) instead of mouseleave (doesn't bubble)
   */
  private handleMouseOut(event: MouseEvent): void {
    const dropdownItem = this.findDropdownItem(event.target);
    const dropdownId = dropdownItem?.dataset.dropdownItem;

    if (!dropdownId) return;

    // Check if relatedTarget (where mouse is going) is outside the dropdown item
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const isLeavingDropdown = !dropdownItem.contains(relatedTarget);

    if (isLeavingDropdown) {
      this.currentHoveredItem = null;

      // Delay closing to allow moving to submenu
      this.hoverTimeout = window.setTimeout(() => {
        this.state.close(dropdownId);
      }, 150);
    }
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
   * Initialize interaction handlers with event delegation
   */
  init(): void {
    // Get menu container
    this.menuElement = document.querySelector('.menu');
    if (!this.menuElement) return;

    // Setup click handlers for triggers (still need individual listeners for click events)
    const triggers = document.querySelectorAll('[data-dropdown-trigger]');
    triggers.forEach((trigger) => {
      // Method is bound in constructor
      // eslint-disable-next-line @typescript-eslint/unbound-method
      trigger.addEventListener('click', this.handleClick);
    });

    // Setup hover handlers using event delegation (2 listeners instead of N*2)
    // Methods are bound in constructor
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.menuElement.addEventListener('mouseover', this.handleMouseOver);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.menuElement.addEventListener('mouseout', this.handleMouseOut);

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

    // Clean up delegated hover handlers
    if (this.menuElement) {
      // Methods are bound in constructor
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.menuElement.removeEventListener('mouseover', this.handleMouseOver);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.menuElement.removeEventListener('mouseout', this.handleMouseOut);
    }

    // Clean up click outside - method is bound in constructor
    // eslint-disable-next-line @typescript-eslint/unbound-method
    document.removeEventListener('click', this.handleClickOutside);

    // Clear state
    this.menuElement = null;
    this.currentHoveredItem = null;

    // Clear any pending timeout
    if (this.hoverTimeout) {
      window.clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }
}
