/**
 * Dropdown State Module
 *
 * Manages open/close state for menu dropdowns.
 * Ensures only one dropdown is open at a time.
 *
 * @module components/Menu/dropdownState
 */

/**
 * Dropdown state manager
 */
export class DropdownState {
  private currentOpenId: string | null = null;

  /**
   * Open a dropdown
   * Closes any currently open dropdown first
   *
   * @param dropdownId - ID of dropdown to open
   */
  open(dropdownId: string): void {
    // Close currently open dropdown if different
    if (this.currentOpenId && this.currentOpenId !== dropdownId) {
      this.close(this.currentOpenId);
    }

    const trigger = document.querySelector(
      `[data-dropdown-trigger="${dropdownId}"]`,
    ) as HTMLElement;
    const dropdown = document.querySelector(
      `[data-dropdown-id="${dropdownId}"]`,
    ) as HTMLElement;
    const item = document.querySelector(`[data-dropdown-item="${dropdownId}"]`) as HTMLElement;

    if (trigger && dropdown && item) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      this.currentOpenId = dropdownId;
    }
  }

  /**
   * Close a dropdown
   *
   * @param dropdownId - ID of dropdown to close
   */
  close(dropdownId: string): void {
    const trigger = document.querySelector(
      `[data-dropdown-trigger="${dropdownId}"]`,
    ) as HTMLElement;
    const item = document.querySelector(`[data-dropdown-item="${dropdownId}"]`) as HTMLElement;

    if (trigger && item) {
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');

      if (this.currentOpenId === dropdownId) {
        this.currentOpenId = null;
      }
    }
  }

  /**
   * Close all dropdowns
   */
  closeAll(): void {
    if (this.currentOpenId) {
      this.close(this.currentOpenId);
    }
  }

  /**
   * Toggle dropdown state
   *
   * @param dropdownId - ID of dropdown to toggle
   */
  toggle(dropdownId: string): void {
    if (this.isOpen(dropdownId)) {
      this.close(dropdownId);
    } else {
      this.open(dropdownId);
    }
  }

  /**
   * Check if dropdown is open
   *
   * @param dropdownId - ID of dropdown to check
   * @returns True if dropdown is open
   */
  isOpen(dropdownId: string): boolean {
    return this.currentOpenId === dropdownId;
  }

  /**
   * Get currently open dropdown ID
   *
   * @returns Currently open dropdown ID or null
   */
  getCurrent(): string | null {
    return this.currentOpenId;
  }
}
