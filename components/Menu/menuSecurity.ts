/**
 * Menu Security Module
 *
 * Validates and sanitizes menu URLs for security.
 * Provides defense-in-depth protection against XSS and injection attacks.
 *
 * @module components/Menu/menuSecurity
 */

import { validateMenuUrl, sanitizeUrl } from '../../lib/security/urlValidator';

/**
 * Validates all URLs in the menu
 * Sanitizes invalid URLs to prevent security issues
 */
export class MenuSecurity {
  /**
   * Validate and sanitize all menu links on initialization
   *
   * @param menuElement - The menu container element
   */
  static validateMenuLinks(menuElement: HTMLElement): void {
    // Get all links in the menu
    const links = menuElement.querySelectorAll<HTMLAnchorElement>('a[href]');

    links.forEach((link) => {
      const url = link.getAttribute('href');
      if (!url) return;

      // Get context from link text for better logging
      const context = link.textContent?.trim() || 'Unknown';

      // Validate URL
      const isValid = validateMenuUrl(url, context);

      // If invalid, sanitize the URL
      if (!isValid) {
        const sanitized = sanitizeUrl(url, '#');
        link.setAttribute('href', sanitized);

        // Add visual indicator in development
        if (import.meta.env.DEV) {
          link.setAttribute('data-url-sanitized', 'true');
          link.style.outline = '2px dashed orange';
          link.title = `Original URL was invalid: ${url}`;
        }
      }
    });
  }

  /**
   * Validate menu links on click to catch dynamic changes
   *
   * @param event - Click event
   * @returns True if navigation should proceed, false to prevent
   */
  static validateOnClick(event: Event): boolean {
    const link = event.currentTarget as HTMLAnchorElement;
    const url = link.getAttribute('href');

    if (!url) {
      event.preventDefault();
      return false;
    }

    // Validate URL
    const context = link.textContent?.trim() || 'Unknown';
    const isValid = validateMenuUrl(url, context);

    if (!isValid) {
      event.preventDefault();

      // In production, fail silently
      if (import.meta.env.DEV) {
        console.error(`[Security] Blocked navigation to invalid URL: ${url}`);
      }

      return false;
    }

    return true;
  }
}
